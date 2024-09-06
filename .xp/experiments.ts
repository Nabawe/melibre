// import anything so that it is a module, else it might not run
import { nanoid as f_makeUUID } from 'nanoid';

// continuation passing style experiment
function returnMultipleValues( f: ( param1: number, param2: number ) => void ) {
    // something that generates multiple values, like 1 and 2
    f( 1, 2 );
};
/* This emulates returning multiples values since the return that matters is the one of the arrow function and the arrow function is manipulating multiples vales that were obtained from the returnMultipleValues function */
returnMultipleValues( ( param1, param2 ) => console.log( param1, param2 ) );
// All this is replaced by returning objects and using destructuring and the spread op

