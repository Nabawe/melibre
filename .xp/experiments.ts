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
const a_LvlIni = [ '(' ];
const a_LvlEnd = [ ')' ];
const a_OpImplicit = [ 'Y' ];
const a_OpAtIni = [ 'N' ];                  // That interact with ( i.e. forwards with terms
                                            // ! might need to define if it uses () or other things
                                            // * there is a need to discriminate between LvlIni and OpAtIni
const a_OpAtEnd = [];                       // That interact with ) backwards with terms
const a_OpAtJoints = [ ' ', 'O', 'Y' ];     // ? Could ' ' be used for Y when it is being trimmed
// Using Arrays in case the operators discriminate order.
const o_OpToBranch = {
    'N' : [],                               // Different Kind of operators might need different treatment
    'O' : [],
    'Y' : [],
};

function f_parseLogic( input: string ) {
    input = input.trim();
    let branch = "";    // The current branch of the Tree being constructed
    const o_Tree = [];  // The Result
    const length = input.length;
    let lvl = 0;
    let i = 0;

    function treeMaker() {
        let buffer = "";    // The characters in waiting

        while ( i < length ) {
            let realChar = input[i];
            let char = realChar.trim().toUpperCase();
            // console.log( i, ' ', char );

            if ( a_LvlEnd.includes( char ) ) {
                buffer += char;
                branch += buffer;
                console.log( 'lvl ', lvl, 'i ', i, 'char ', char, 'buffer ', buffer );
                lvl--;
                // if ( lvl === 0 )
                // buffer = "";
                i++;
                // treeMaker();
                // return;
                break;
            };

            if ( a_LvlIni.includes( char ) ) {
                buffer += char;     // aqui y en LvlEnd hay q mejorar la logica para sabr cuando toma los chars anteriores y seguir viendo q pasa con buffer al volver, si es q retiene los numeros anteriores
                branch += buffer;
                lvl++;
                console.log( 'lvl ', lvl, 'i ', i, 'char ', char, 'buffer ', buffer );
                // continue;   // * recursion start instead of continue
                // buffer = "";
                i++;
                treeMaker();
            };

            if ( lvl === 0 ) {
                branch += realChar;
            } else {
                buffer += realChar;
            };

            console.log( 'lvl ', lvl, 'i ', i, 'char ', char, 'realChar ', realChar, 'buffer ', buffer );
            i++;
        };

        if ( i < length )
            treeMaker();

        return;
    };

    treeMaker();

    return {
        'input': input,
        'branch': branch,
        // 'buffer': buffer,
        'o_Tree': o_Tree,
    };
};

console.info( 'result : ', f_parseLogic( '012 (3 (45) 6) 789' ) );








function parseLogicalQuery(query: string) {
    const tokens = query.match(/(\s*n\s*\(\s*|\s*\(\s*|\s*\)\s*|\s*[yYoO]\s*|\s*[^()\s]+\s*)/g) || [];
    let index = 0;

    function parseExpression(defaultOp = 'Y') {
        let result = [];
        let currentOp = defaultOp;

        while (index < tokens.length) {
            let token = tokens[index++].trim();
            let compToken = token.toUpperCase();

            if (token === ')') {
                break;
            } else if (token === '(') {
                result.push(parseExpression(currentOp));
            } else if (compToken.startsWith('N')) {
                index++; // Skip the opening parenthesis after 'n'
                result.push({ 'N': [parseExpression(currentOp)] });
                index++; // Skip the closing parenthesis
            } else if (compToken === 'O') {
                currentOp = compToken;
            } else if (compToken === 'Y') {
                currentOp = compToken;
            } else {
                result.push(token); // This is an FVP term
            }
        }

        // If there's only one item and we're not at the top level, return it directly
        if (result.length === 1 && defaultOp !== 'Y') {
            return result[0];
        }

        // Combine items with the same operator
        return { [currentOp]: result };
    }

    const parsed = parseExpression();

    // If the top level has only one child, unwrap it
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

// testQueries.forEach(query => {
//     console.log("Query:", query);
//     console.log("Parsed:", JSON.stringify(parseLogicalQuery(query), null, 2));
//     console.log("---");
// });



/*
const getMaxCallStackSize = (i) => {
    try {
        return getMaxCallStackSize(++i);
    } catch {
        return i;
    }
};

console.log(getMaxCallStackSize(0));

*/
