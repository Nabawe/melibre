// import anything so that it is a module, else it might not run
import { nanoid as f_makeUUID } from 'nanoid';

// continuation passing style experiment
function returnMultipleValues(f: (param1: number, param2: number) => void) {
    // something that generates multiple values, like 1 and 2
    f(1, 2);
};
/* This emulates returning multiples values since the return that matters is the one of the arrow function and the arrow function is manipulating multiples vales that were obtained from the returnMultipleValues function */
returnMultipleValues((param1, param2) => console.log(param1, param2));
// All this is replaced by returning objects and using destructuring and the spread op


/*
    const fieldValuePatter1 = /([a-zA-Z0-9_]+):([^:]*?):/g;
    const fieldValuePatter2 = /([a-zA-Z0-9_]+)(?::([=!<>gl]))?:([^:]*?):/g;
    const fieldValuePatter3 = /([a-zA-Z0-9_]+)(?::([=!<>gl]):)?([^:]+):/g;
*/
/*
const fieldValuePattern = /([a-zA-Z0-9_]+)(?::([=!<>gl])?(?::([^:]*)?)?)?(?::|$)/g;

// field no puede tener espacios

const testCases = [
    "field1:=:value1:",
    "field2:value2:",
    "field3::value3:",
    "field4:::",
    "field5::",
    "field6",
    "field7:=:",
    "field8:=::",
    "field9:=:value9:field10::value10:field11:value11:",
    "fieldSpaces: = :  :",
];

testCases.forEach(test => {
    const matches = Array.from(test.matchAll(fieldValuePattern));
    matches.forEach(match => {
        const [fullMatch, field, operator, value] = match;
        console.log(`Full match: "${fullMatch}"`);
        console.log(`Field: "${field}", Operator: "${operator || ''}", Value: "${value || ''}"`);
        console.log('---');
    });
});
 */

function parseLogicalQuery(query: string) {
    const tokens = query.match(/(\s*n\s*\(\s*|\s*\(\s*|\s*\)\s*|\s*[yYoO]\s*|\s*[^()\s]+\s*)/g) || [];
    tokens.push(')'); // Add a closing parenthesis to simplify processing

    let index = 0;

    function parseExpression() {
        let result = [];
        let currentOperator = 'Y'; // Default to AND

        while (index < tokens.length) {
            let token = tokens[index++].trim();

            if (token === ')') {
                break;
            } else if (token === '(') {
                result.push(parseExpression());
            } else if (token.toLowerCase() === 'n(') {
                result.push({ 'N': parseExpression() });
            } else if (token.toLowerCase() === 'y' || token.toLowerCase() === 'o') {
                currentOperator = token.toUpperCase();
            } else {
                result.push(token); // This is an FVP term
            }
        }

        // If there's only one item, return it directly
        if (result.length === 1) {
            return result[0];
        }

        // Otherwise, wrap it in an object with the current operator
        return { [currentOperator]: result };
    }

    const parsed = parseExpression();

    // Remove the top-level Y if it's just wrapping a single item
    if (parsed.Y && parsed.Y.length === 1) {
        return parsed.Y[0];
    }

    return parsed;
}

// Test the function
const testQueries = [
    "FVP3 y ( n ( FVP1 ) FVP2 ) FVP4",
    "FVP1 o ( n ( FVP2 o FVP3 ) )",
    "( FVP1 o FVP2 ) n ( FVP3 y ( FVP4 o FVP5 ) )",
    "FVP1 FVP2 o FVP3"
];

testQueries.forEach(query => {
    console.log("Query:", query);
    console.log("Parsed:", JSON.stringify(parseLogicalQuery(query), null, 2));
    console.log("---");
});
