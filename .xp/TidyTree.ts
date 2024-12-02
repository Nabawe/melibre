/* * NADA DE TEXTO ARRIBA DE LA DEF DEL SIMBOLO, escribir en el encabezado o pie del doc las cosas generales, explicativas, etc y solo poner dentro del statement lo especifico, recordatorio lo mas corto posible.
    * Lo mismo para los WIPs, y To-Dos agruparlos arriba o abajo, tal vez esto sea mejor abajo y explicaciones arriba, usar _Q template.
    * Explicar lo de Arrays all the way y la idea de tags para guardar info. Ver draft.txt y Odday.
*/


/* AI Hi here is my first attempt, could you tell me how would you improve it? also review ALL comments that aren't docstrings as they highlight questions and issues, they are numbered for you to reference. */
    /* !!! It might need more tokens that the ones it can output in a single response it might be wise to ask it to review just half then the other half */


/* Type Helpers that extract the type of the key or value of a Map. "never" is returned if what was being checked is not a Map, as a way to return an error.
I am not completly sure this is the right way. */
type h_MapValueType<T> = T extends Map<any, infer V> ? V : never;
type h_MapKeyType<T> = T extends Map<infer K, any> ? K : never;

type t_Key = string | number | symbol;
type t_Iddir = Map<number, c_TidyBranch>;
interface t_TidyBranchParams {
    data?: any;
    id: number;
    parent?: c_TidyBranch;  // needs to be optional so that Root's can be empty or it self.
};


/** // WIP add class description, branchReference vs pointer vs branch?
  * @property {branch[]} layout - Branch children arrangement. Warning: Reconstructed during operations that create gaps, avoid direct references.
  * @property {map<id, position>} positions - Maps child IDs to positions, used for optimizing operations and layout reconstruction.
*/
class c_TidyBranch {
    /* There is a way to use the "implements" TS keyword to avoid the need to repeat the typings of data, id, parent, etc but then the posiblity to specify that they are optional or other modifiers is lost. */
    public data?: any;
    public readonly id: number;
    public layout: h_MapValueType<t_Iddir>[] = [];  // children, layout was more graphic
    public parent?: c_TidyBranch;
    public positions: Map< h_MapKeyType<t_Iddir>, number > = new Map();  // children positions was too long
    constructor( { data, id, parent }: t_TidyBranchParams ) {
        /* this replaces this.id = id like lines, I just dislike that I am wasting 3 objects, on the instance creation with the "new" line then in the destructuring params and lastly recreating an object using Object.assing to copy them, but this seams easier to mantain and cleaner. */
        // ? ask how much wasteful is this line vs the multiple lines expressions.
        Object.assign( this, { data, id, parent } );
    };

    // ! Missing: Call and or Index signature to manipulate the children with a cleaner expression

    get size() {
        return this.positions.size;
    };

    get length() {
        return this.layout.length;
    };

    // m_set
        // ? ya q todo se hace con metodos layout y positions deberian ser read only?

    // Would branchReference be better?
    m_push( pointer: c_TidyBranch ) {
        this.positions.set( pointer.id, this.layout.length );
        this.layout.push( pointer );
    };

    // m_delete()
};


/** Class Description.
  * @param {string} fileDir The path must end with a slash /
*/
class c_TidyTree {
    /* 8- Did I mess up the initialization and the constructor? are seq and Root properly initializated or is there a better way?. For example on data I made the typing explisit but isn't there a better way that brings all the typings from the previously defined types like t_Root and t_RootProps */
    public lastId: number = -1;
    public Mimir: t_Mimir = new Map();
    public Root: t_Root;
    private seq: { currentBranch: t_BranchOrRoot; prevBranch: t_BranchOrRoot };
    constructor() {
        /* * The reason for members to be defined to Root directly is so that it shouldn't need a special treatment when doing Branch like operations. */
        /* 9- Is this descriptor correct? or for a method I should turn writable or something off? but what if afterwards I want to make a hook or some other modification? Is there a better way to define this method for Root? */
        const CommonRootPropsCfgs = {
            configurable: true,
            enumerable: false,
            writable: true,
        };
        this.Root = Object.defineProperties( new Map() as t_Root, {
            data: {
                ...CommonRootPropsCfgs,
                value: undefined,
            },
            // Methods
            /* An arrow f is used here since the class instance is needed to access lastId. */
            m_push: {
                ...CommonRootPropsCfgs,
                value: ( newBranch: t_TidyBranch ) => {
                    this.Root.set( this.lastId, newBranch );
                },
            },
        } );

        /* 10- Shouldn't be possible to move seq block atop the constructor? I get errors saying Root is not defined if I do so. */
        this.seq = {
            currentBranch: this.Root,
            prevBranch: this.Root,
        };
    };

    /* * For documenting and styling reference examples check the methods init, dataChecks from RAMBox, but don't use a private init method, put that kind of code inside the constructor unless there is some kind of a special need like reset button */

    // Index Signature
    // Explain
    // comment on how this use is counter intuitive
    // test what kind of values the Signature can have, it might need the key:any value:any typing.
    // any[]
    // Don't forget that proxies can be used to control the access to the props
    [ key: t_Key ]: any;

    // ? 11- Which is best # or private to hide a method?
    m_genid() {
        // This way it won't matter if something gets deleted
        return ++this.lastId;
    };

    /* the opposite could be cull o preguntar como se dice podar? debe haber un verbo especifico para 'cortar ramas' */
    // 12- Shouldn't it be { data, parent, id }: t_TidyBranchProp ? I get errors doing so.
    m_sprout( { data, parent = this.Root } ) {
        const id = this.m_genid();
        const newBranch = f_createTidyBranch( { data, id, parent } );
        this.Mimir.set( id, newBranch );
        parent.m_push( newBranch );
        return newBranch;
        // return this.Mimir.set( id, f_createTidyBranch( arguments[0] ) );
        /* ? 12- if the return line was defined as in the comment above, When parent or id use the default values (this.Root for example) Would they get properly passed via arguments[0]?, I believe this would not work since arguments[0] should reference to the original object but I am not sure. */
    };

    m_get( id: t_TidyBranchProps['id'] ) {
        return this.Mimir.get( id );
    };

    m_triangulate( ...Coords: number[] ) {
        // Coords function call signature
        try {
            let str = '';
            for ( const k of Coords ) str += `[${k}]`;

            // eval or use a function to use the string version of the coords on this.Root
            // this.Root
            // return match;
        } catch( err ) {
            // Out of bounds + JavaScript error should be the output
            // return console.error( new Error( `${ErrsMsgs.CLASS__INIT}:\n ${( err as Error ).message}`, { cause: 'CLASS__INIT' } ) );
        };
    };

    // ! Agregar algun tipo de checkeo a las acciones sequenciales para garantizar q no queden niveles abiertos.
        /* Eso implicaria q estos 3 metodos sean privados y q se use un solo comando q los dispara como corresponda para acegurarse q se cierre, ya q en realidad quedar abierto no estaria mal pork uno tiene q poder elegir q el arbol no siga creciendo y luego continuar creciendolo donde estaba antes */
        // * la condicion para terminar entonce sería this.seq.currentBranch === this.Root

    m_sequentialBranching( data: t_TidyBranchProps['data'] ) {
        /* the dif between this and m_sprout is that this one is used to sequentialy build the tree from structures like groups of Field Value Expressions */
        const parent = this.seq.currentBranch;
        const id = this.m_genid();
        const newBranch = f_createTidyBranch( { data, id, parent } );
        this.Mimir.set( id, newBranch );
        parent.m_push( newBranch );
        return newBranch;
    };

    m_sequentialLevelUp( data: t_TidyBranchProps['data'] ) {
        this.seq.prevBranch = this.seq.currentBranch;
        const parent = this.seq.currentBranch;
        const id = this.m_genid();
        const newBranch = f_createTidyBranch( { data, id, parent } );
        this.Mimir.set( id, newBranch );
        parent.m_push( newBranch );
        this.seq.currentBranch = newBranch;
        return newBranch;
    };

    m_sequentialLevelDown() {
        // ? this.seq.currentBranch.parent vs this.seq.prevBranch
        this.seq.currentBranch = this.seq.prevBranch;
    };

    /*
        El dibujo buscaria algo asi como, no lo hice coincidir con el exp de abajo
        if data === undefined then print N/A or 00
            A[
                A1
                A2
                B[
                    B1
                    B2
                    C[
                        C1
                        C2
                    ]
                ]
                A3
            ]
    */
    // instanceof or Array.isArray()
    /* Object.hasOwn() or in ( creo q in es mas lento ya q checkea prototype chain pero realmente no se cuanto mas lento ) */
    m_printRoot() {
        let on = true;
        let branch = this.Root;
        let lvl = 0;
        const pos: number[] = []; // cada indice guarda la posicion en la q se estaba para cada nivel
        // ! no olvidarse lo pensado antes ya q aqui creo q lo toy forzando y creo q tendria q separar la iteracion de Root de las branches ya q son un poco distintas, esta en old ideas abajo de todo en este archivo
        /* termina cuando se esta en el lvl 0 y este no tiene mas elementos, tal vez comparando con el length PERO esto se puede simplificar checkeando si hay un elemento asignable o sea undefined o un agujero en la chain */
        while ( on ) {
            // hay q hacer el for de esta forma ya q se va a necesitar recordar en q parte de la array estaba uno parado para continuar al subir y bajar d niveles
            // el || 0 es para initializar cuando el nivel esta undefined en pos
            for ( let i = pos[lvl] || 0, active: t_TidyBranch ; active = branch[i] ; i++ ) {
                // this is the workarround for a lack of ""instaceof"" t_TidyBranch check
                // pero Root no tiene data, eso no es un error ya q podria empesar con un modifier?
                if ( 'data' in active ) {
                    if ( active.size > 0 ) {
                        console.log( `${active.data}[` );  // ! falta el cerrar ]
                        // go back to the while to go deeper
                    } else {
                        console.log( active.data );
                    };
                };
            };
        };
    };

    // m_getBranchCoords
        /* usando el Index does an inverted travelsal parent to parent and returns the specified Branch coordinates */

    // m_cloneFromOldTree( origing: t_TidyTree ) {};
        /* the idea would be to make a new tree based on the old one using a deep copy as to avoid affecting the original */

    // m_createFromLitteral
        /* here one could feed the class with an array of arrays expression like [ [].storage = 1, [ [], [].storage = 2 ] ] that reserves words like storage to skip those props since they wont be flagged as not enumerable and creates a propper TidyTree */
        /* or it could be created from a string using a completly custom way like [ []1, [ [], []2 ] ]*/
};

// export type { t_TidyBranchProps };
export { c_TidyBranch } ;
export default c_TidyTree;


const BranchTest = new c_TidyBranch( { data: "asdasd", id: 123 } );
