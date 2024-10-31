/* * NADA DE TEXTO ARRIBA DE LA DEF DEL SIMBOLO, escribir en el encabezado o pie del doc las cosas generales, explicativas, etc y solo poner dentro del statement lo especifico, recordatorio lo mas corto posible.
    * Lo mismo para los WIPs, y To-Dos agruparlos arriba o abajo, tal vez esto sea mejor abajo y explicaciones arriba, usar _Q template.
    * Explicar lo de Arrays all the way y la idea de tags para guardar info. Ver draft.txt y Odday.
*/

import { Interface } from "readline";

/* AI Hi here is my first attempt, could you tell me how would you improve it? also review ALL comments that aren't docstrings as they highlight questions and issues, they are numbered for you to reference. */
    /* !!! It might need more tokens that the ones it can output in a single response it might be wise to ask it to review just half then the other half */

/* ? 1- When referencing the values that a key in an object could take MDN Docs mention a "template literal type" how do I add it to t_Key? */
type t_Key = string | number | symbol;
type t_Mimir = Map<number, t_TidyBranch>;

/* 2- Improve t_TidyBranch, a TidyBranch should be an array with special extra props that could cointain either no other TidyBranches or infinite nested TidyBranches. Here I used an array of arrays which I think it is incomplete and could fail if I nest TidyBranches like [ [ [] ] ] */
// 3- Also should this be an interface instead of a type?
type t_TidyBranch = [][] & t_TidyBranchProps;
interface t_TidyBranchProps {
    data?: any;
    // 4- Shouldn't it be t_TidyBranch | c_TidyTree.Root and not any array
    parent: t_TidyBranch | [];
    rootId: keyof t_Mimir;
};


/* 5- Add Docstring, general description, general use of the parameters, or would it be better if it is added to the type t_TidyBranch? */
/* ? 6- If this function used clasical parameters ( not passed as an object ), would there a way to use the props in t_TidyBranch to type the parameters of the function since they will always need to match? */
function f_createTidyBranch( { data, parent, rootId }: t_TidyBranchProps ): t_TidyBranch {
    const CommonProps = {
        configurable: true,
        enumerable: false,
        writable: true,
    };
    return Object.defineProperties( [], {
        data: {
            ...CommonProps,
            value: data,
        },
        parent: {
            ...CommonProps,
            value: parent,
        },
        rootId: {
            ...CommonProps,
            value: rootId,
        },
    } );
};


/** Class Description.
  * @param {string} fileDir The path must end with a slash /
*/
class c_TidyTree {
    public Mimir: t_Mimir = new Map();
    public Root: t_TidyBranch[] = [];
    public lastId: number = -1;
    constructor() {
    };

    /* * For documenting and styling reference examples check the methods init, dataChecks from RAMBox, but don't use a private init method, put that kind of code inside the constructor unless there is some kind of a special need like reset button */

    // Index Signature
    // Explain
    // comment on how this use is counter intuitive
    // test what kind of values the Signature can have, it might need the key:any value:any typing.
    // any[]
    // Don't forget that proxies can be used to control the access to the props
    [ key: t_Key ]: any;

    // ? 7- Which is best # or private to hide a method?
    private m_genId() {
        return ++this.lastId;
    };

    /* the opposite could be cull o preguntar como se dice podar? debe haber un verbo especifico para 'cortar ramas' */
    // 8- Shouldn't it be { data, parent, rootId }: t_TidyBranchProp ? I get errors doing so.
    m_sprout( { data, parent } ) {
        parent = parent || this.Root;
        const rootId = this.m_genId();
        const newBranch = ( f_createTidyBranch( { data, parent, rootId } ) );
        parent.push( this.Mimir.set( rootId, newBranch ) );
        return newBranch;
        // return this.Mimir.set( rootId, f_createTidyBranch( arguments[0] ) );
        /* ? 9- if the return line was defined as in the comment above, When parent or rootId use the default values (this.Root for example) Would they get properly passed via arguments[0]?, I believe this would not work since arguments[0] should reference to the original object but I am not sure. */
    };

    m_get( rootId: t_TidyBranchProps["rootId"] ) {
        return this.Mimir.get( rootId );
    };

    m_triangulate( ...Coords ) {
        // Coords function call signature
        try {
            let str = '';
            for ( const k of Coords )
                str += `[${k}]`

            // eval or use a function to use the string version of the coords on this.Root
            // this.Root
            // return match;
        } catch( err ) {
            // Out of bounds + JavaScript error should be the output
            return console.error( new Error( `${ErrsMsgs.CLASS__INIT}:\n ${( err as Error ).message}`, { cause: 'CLASS__INIT' } ) );
        };
    };

    m_openBranch() {
        /* the dif between this and m_sprout is that this one is used to sequentialy build the tree from a group of Field Value Expressions */
    };

    m_closeBranch() {

    };

    // m_getBranchCoords
        /* usando el Index does an inverted travelsal parent to parent and returns the specified Branch coordinates */

    // m_cloneFromOldTree( origing: t_TidyTree ) {};
        /* the idea would be to make a new tree based on the old one using a deep copy as to avoid affecting the original */

    // m_createFromLitteral
        /* here one could feed the class with an array of arrays expression like [ [].storage = 1, [ [], [].storage = 2 ] ] that reserves words like storage to skip those props since they wont be flagged as not enumerable and creates a propper TidyTree */
        /* or it could be created from a string using a completly custom way like [ []1, [ [], []2 ] ]*/
};

export type { t_TidyBranch };
export { f_createTidyBranch } ;
export default c_TidyTree;

// const a = new c_TidyTree();
// a.Mimir.set( 'asd', [[],[]] );
// const b = new c_TidyTree();
// b.Mimir.set( 'zxc', [[]] );
// b.Mimir.set( 'fgh', [[],[],[ [] ]] );

// console.info(
//     'a : ', a.Mimir, '\n',
//     'b : ', b.Mimir
// );





/* Old Ideas

private m_genId() {
    return 'i' + this.Mimir.size + 1;
    // ? I understand string literals are faster am I wrong? Would the line below be better?
    // return `i${this.Mimir.size + 1}`;
};

*/

/* To-Do
    + Add Docstrings with a general description and its params to each method.
*/
