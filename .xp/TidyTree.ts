// !!! revisar las notas de TidyTree.old.ts

/* * NADA DE TEXTO ARRIBA DE LA DEF DEL SIMBOLO, escribir en el encabezado o pie del doc las cosas generales, explicativas, etc y solo poner dentro del statement lo especifico, recordatorio lo mas corto posible.
    * Lo mismo para los WIPs, y To-Dos agruparlos arriba o abajo, tal vez esto sea mejor abajo y explicaciones arriba, usar _Q template.
    * Explicar lo de Arrays all the way y la idea de tags para guardar info. Ver draft.txt y Odday.
*/
/* * Comments Guidelines
    - Arriba de cada Clase o f dejar para DocStrings y abajo de todo agregar como block comments, Insights, Questions, etc. Solo poner lo critico y en lo posible en gris dentro del codigo.
*/


/* AI Hi here is my first attempt, could you tell me how would you improve it? also review ALL comments that aren't docstrings as they highlight questions and issues, they are numbered for you to reference. */
    /* !!! It might need more tokens that the ones it can output in a single response it might be wise to ask it to review just half then the other half, send the entire file so it has context but ask to answer from question x to y in a single reply, then progress to x1 to y1, ... */


/* Type Helpers that extract the type of the key or value of a Map. "never" is returned if what was being checked is not a Map, as a way to return an error.
I am not completly sure this is the right way. */
type h_MapValueType<T> = T extends Map<any, infer V> ? V : never;
type h_MapKeyType<T> = T extends Map<infer K, any> ? K : never;

type t_Key = string | number | symbol;
type t_IddirKey = h_MapKeyType< c_TidyTree['Iddir'] >;
type t_IddirValue = h_MapValueType< c_TidyTree['Iddir'] >;
// type t_Iddir = Map<number, c_TidyBranch>;
// type t_IddirKey = h_MapKeyType<t_Iddir>;
// type t_IddirValue = h_MapValueType<t_Iddir>;
// interface t_TidyBranchParams {
//     data?: any;
//     id: number;
//     parent?: c_TidyBranch;  // needs to be optional so that Root's can be empty or it self.
// };


// Remove .layout DocString warning unless there are actually methods that result in sparce arrays
/** // WIP add high level class description, branchReference vs pointer vs branch?
  * @property {branch[]} layout - Branch children arrangement. Warning: Reconstructed during operations that create gaps, avoid direct references.
  * @property {map<id, position>} positions - Maps child IDs to positions, used for optimizing operations and layout reconstruction.
*/
class c_TidyBranch {
    public static hostTree: c_TidyTree;
    public layout: t_IddirValue[] = [];
    public positions: Map< t_IddirKey, number > = new Map();
    /** @param {c_TidyBranch} [parent] - Must be specified for all branches except Root. The property was set as optional since Root would have no parent to be assigned to. */
    constructor(
        public readonly id: t_IddirKey,
        public level?: number,
        public parent?: c_TidyBranch | null,
        public data?: any ) {
    };

    // ? should I remove the setter fuction for .layout.length?

    get size() {
        return this.positions.size;
    };

    get length() {
        return this.layout.length;
    };

    /* * Insights
        - Most methods were removed from the Branches since they tend to require the modification of other Branches and Iddir on a big scale. For example if m_delete was fitted into the c_TidyBranch then one of the methods steps will be to ask its children to delete its own children, clear its parent reference, etc and so on, making a cascade that could cause an stack overflow.
        Similar issues happened with other methods, since they ended requiring troublesome manipulations of .layout or .positions .
        - Parent is left as optional not only because it made sense for the Root Branch but most of the times c_TidyBranch will be used just to spawn the instance and then a method like m_add, m_sprout or m_insert will link the newly created Branch to its parent and make the reference.
        - Index and Call Signatures
            The Index Signature was dropped since to propperly set it it would require the use of a Proxy which in turn will add a big overhead to any operation since Proxies require to intercept EVERYTHING. They might be useful in the Tree but making every Branch slower was not acceptable.
            Therefore if I what I might add is a method m_accessByCoords and use the Call Signature to access a specific ID,
                * but the more I think about it the more it seams better to manipulate everything from the Tree, leaving the Branches as close as a pure container object which has its properties defined by a class contructor.
        - Proxies
            * To reduce proxy overhead may be one can create a container object that only exposes the methods the proxy would use, that way the "real instance" with many different members stays optimized and the proxy works on the container so that it does not need to iterate on all the members, a proxy for the proxy.
        - .layout, .positions & .parent
            I am still unsure if I am going to add manipulation methods inside the Branch class since it seams that every time any of the 3 props are modified in a single Branch a "birds eye view", and cascading access to multiple Branches, are needed so that said modification makes sense. So again it seams it makes more sense to manage everything from the Tree.
    */
    /* ? Questions
        - should all Branch properties be manipulated through methods?
        - .layout and .positions : should I limit its access?, how?, is it really worth it?, best practices? make public methods to control their access and modification but make the properties private?. Would setting them to read-only be a mistake, since sometimes I might need to recreate them and read-only locks re-refrencing using the same name, right?. The thinking came about to protect the integrity and make sure that any modification in .layout gets automatically and properly reflected on .positions and vice-versa.
            * Make .layout & .positions readonly and private, if they need to be modified their read-only status can be modified on the fly with .defineProperty(), and they should not be direct accessible, all through specialiced setters, getters and methods to ensure they are properly modified.
        - What about .data? the core idea was that it is freely accessible and modifiable, should I also make methods to alter it?.
        !!! So do I need to make methods that allow the Tree and others to alter and read all of the Branch properties? this question is a bit different from the first one, this time I am thinking about how to properly control branches.
            * Setter, Getters, ir programando c_TidyTree e ir viendo q se necesita simplificar o como lo necesita modificar y en base a eso crear los.
    */
};


/** Class Description.
  * @property
*/
class c_TidyTree {
    // 8 is an important old TidyTree question, remember to check all of that file's questions.
    /* 8- Did I mess up the initialization and the constructor? are seq and Root properly initializated or is there a better way?. For example on data I made the typing explisit but isn't there a better way that brings all the typings from the previously defined types like t_Root and t_RootProps. */
    /* Should this type of comments be on a DocString? though the .lastId prop proper initialization is important, since its unrelated to its use I think it shouldn't be on the DocString, is there a better place for the comment or format? like atop the prop?. */
    /* I am unsure if this should be private or protected */
    protected static treesCount = 0;
    /* The type of a class vs the type of its instances
        The typing here is " typeof c_TidyBranch " since this won't be an instance of the class but the class it self, what I gather is that typeof returns a type that describes the constructor function of the class with :
        - constructor signature ( similar to how functions are typed )
            new(id: number): MyClass
        - static properties and methods
        - callable properties
    */
    public BranchFactory = c_TidyBranch;
    // this.id = ++c_TidyTree.treesCount;
    public id = ++c_TidyTree.treesCount;
    public Iddir: Map<number, c_TidyBranch> = new Map();
    public lastId = 0; // set to -1 if .Root is initialized differently.
    /* Would it be better to set Root.parent = null?, yes else the prop might not even exist and this way it is also explisitly said that Root has no parent, another posibility could be that Root is its own parent but I think that might lead to infinite loops in some cases. */
    public Root: c_TidyBranch = new c_TidyBranch( 0, 0, null );
    protected seq = { currentBranch: this.Root, prevBranch: this.Root };
    constructor() {
        c_TidyBranch.hostTree = this;
        this.BranchFactory = c_TidyBranch;
    };

    // Index Signature
    // [ key: number ]: c_TidyBranch;
    // [ key: t_Key ]: any;

    // Call Signature
    /* Call Signatures
        ( this: c_TidyBranch, ...coords: number[] ): any {
            return this.fSearch(...coords);
        };
        ( this: c_TidyBranch, id: h_MapValueType<t_Iddir> ): c_TidyBranch {
            return this.getId( id );
        };
    */
    // ( this: c_TidyTree, id: t_IddirKey ): c_TidyBranch {
    //     return this.m_get( id );
    // };

    // ? 11- Which is best # or private to hide a method?
    m_genId() {
        // This way it won't matter if something gets deleted
        return ++this.lastId;
    };

    // ! needs something in case it is not found or is it pointless in this case? at least it should return false, well undefined is a falsy value but that could be what is stored inside the map, then what would be the correct practice? null? undefined? ask AI?
    m_get( id: c_TidyBranch['id'] ) {
        return this.Iddir.get( id );
    };


    // ! push should be able to take multiple branches to add at a time
    // !!! q pasa si se pushea un elemento q ya existe, va a existir o tener 2 posiciones o si permitirlo?
    // ! Tambien parece q algo puede hacer a.m_push( a ), no deberia ser permitido o si?
        // if ( parent === pointer ) return error;
        // * PERO PARA METODOS INTERNOS ESO NO DEBERIA PASAR YA Q SE ENTIENDE Q TIENEN Q CUMPLIR CON
        // EN TODO CASO CREAR UNA DOCSTRING Q ESPECIFIQUE CON Q TENER CUIDADO asi q pensar en las posibilidades d lo q NO SE DEBERIA HACER
    m_link( parent: c_TidyBranch, pointer: c_TidyBranch ) {
        parent.positions.set( pointer.id, parent.layout.length );
        parent.layout.push( pointer );
        pointer.parent = parent;
        /* I get the error: 'parent.level' is possibly 'undefined'.ts(18048)
            But  m_sprout( { data, parent = this.Root } ) {
                which calls m_link will always have a parent, furthermore:
                    this.m_link( parent, newBranch );
                parent is a mandatory parameter, how should I fix it?

            I'm looking for better sollutions than :
                pointer.level = parent.level! + 1;
                pointer.level = parent.level | 0 + 1;

            Or is this a TypeScript limitation?.
        */
        pointer.level = parent.level + 1;
    };

    // Would branchReference be better?

    /* the opposite could be cull o preguntar como se dice podar? debe haber un verbo especifico para 'cortar ramas' */
    // 12- Shouldn't it be { data, parent }: t_TidyBranchProp ? I get errors doing so.
    // the Id should not be specified, it should be managed by the Class.
    // may be m_add is a better name?
    // should m_sprout specify the position or that would be m_insert?
    m_sprout( parent = this.Root, data: any ) {
        const id = this.m_genId();
        const newBranch = new c_TidyBranch( id, undefined, undefined, data );
        this.Iddir.set( id, newBranch );
        this.m_link( parent, newBranch );
        return newBranch;
    };

    /* * Insights
        - moved here from the Branch class
        - DELETE should be in the Tree, a Branch should only modify it self and not its children, furthermore it has no way of deleting the reccords in Iddir.
        - Should I delete the object it self or only clear all the references?
        - use vars to avoid repeating this.xxxx ?
        - 'try catch' to manage failures and errors?
        - if possition or id are not destructured will they still be initialized? Will the scope be limited to the if clause or re initialized?
        ! Need to properly delete all references, if a children ends with no parent then they and their children should also be deleted.
        - m_deleteRange()
        - m_splice and m_toSpliced?
        ! this was written in the Branch
        - check the BranchTest s
        - The ammount of modifications should be taken into account when modifying .positions, if the number is greater than .size then recreating the property should be faster than modifying.
    */
    /* Used this approach intead of creating two methods or using function overloading to try to ensure that id and position aren't mixed up. */
    /** @description If id and position are both specified only the specified id will be deleted. */
    m_delete( { id, position }: { id?: h_MapKeyType<t_Iddir>; position?:number; } ) {
        let target: c_TidyBranch;
        if ( id ) {
            // ? ask if there is a better sollution than to use -1
            position = this.positions.get( id ) || -1;
            target = this.layout[position];
        } else if ( position ) {
            target = this.layout[position];
            id = target.id;
        } else {
            // error ? is it really needed? or Does destructuring parameters make all the parameters optional? ( I know I specified it in the type but how do you make a single destructuring parameter optional? And the type is not the same as JavaScript )
            return false;
        };
        // use splice or toSpliced? or is my method faster?
        if ( target ) {
            this.layout.splice( position, 1 );
            this.positions.delete( id );
            for ( let i = position, len = this.layout.length ; i < len ; i++ )
                this.positions.set( this.layout[i].id, i );
            return target;
        } else {
            return false;
            // error or false as it doesn't exist? but wasn't false used for successful operations
        };
    };
    /*
        const BranchTest0 = new c_TidyBranch( 0, undefined, "data of 10" );
        const BranchTest1 = new c_TidyBranch( 10, BranchTest0, "data of 10" );
        const BranchTest2 = new c_TidyBranch( 20, BranchTest0, "data of 20" );
        const BranchTest3 = new c_TidyBranch( 30, BranchTest0, "data of 30" );
        const BranchTest4 = new c_TidyBranch( 40, BranchTest0, "data of 40" );

        const BranchTest31 = new c_TidyBranch( 31, BranchTest3, "data of 31" );

        const BranchTest311 = new c_TidyBranch( 311, BranchTest31, "data of 311" );

        BranchTest0.m_push( BranchTest1 );
        BranchTest0.m_push( BranchTest2 );
        BranchTest0.m_push( BranchTest3 );
        BranchTest0.m_push( BranchTest4 );

        BranchTest3.m_push( BranchTest31 );

        BranchTest31.m_push( BranchTest311 );

        // BranchTest3.m_delete( { id: BranchTest31.id } );        // ! fails
        BranchTest31.m_delete( { id: BranchTest311.id } );        // ! fails
        // BranchTest0.m_delete( { id: BranchTest4.id } );      // works
        // BranchTest0.m_delete( { id: BranchTest2.id } );      // works

        console.log( 'TEST OUTPUT' );
        console.dir( BranchTest0, { depth: null } );
    */

    /* ! WRONG ( moved here from the Branch class ) delete must be carried out by the Tree, just deleting the Positions record would leave floating Branches */
    m_set( position: number, pointer: c_TidyBranch ) {
        const prev = this.layout[position].id;
        this.positions.delete( prev );
        this.layout[position] = pointer;
        this.positions.set( pointer.id, position );
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

    // m_insert, m_pop, m_shift, m_unshift, etc for stack like management

    // m_getBranchCoords
        /* usando el Index does an inverted travelsal parent to parent and returns the specified Branch coordinates */

    // m_cloneFromOldTree( origing: t_TidyTree ) {};
        /* the idea would be to make a new tree based on the old one using a deep copy as to avoid affecting the original */

    // m_createFromLitteral
        /* here one could feed the class with an array of arrays expression like [ [].storage = 1, [ [], [].storage = 2 ] ] that reserves words like storage to skip those props since they wont be flagged as not enumerable and creates a propper TidyTree */
        /* or it could be created from a string using a completly custom way like [ []1, [ [], []2 ] ]*/
    /* * Insights
    */
    /* ? Questions
    */
};

// export type { t_TidyBranchProps };
// export { c_TidyBranch } ;    // the Branches should not be used outside of this Tree class
export default c_TidyTree;

const Branch0 = new c_TidyBranch( 0, undefined, "data of 0" );
const Branch1 = new c_TidyBranch( 1, Branch0, "data of 1" );
const Branch2 = new c_TidyBranch( 2, Branch0, "data of 2" );

Branch0.m_push( Branch1 );
Branch0.m_push( Branch2 );

console.log( 'TEST OUTPUT' );
console.log( Branch0[1] );
console.log( Branch0['layout'][1] );
// console.dir( Branch0, { depth: null } );
// console.info( BranchTest3.layout );

// console.log( 'SPREAD TEST' );

// const ar1 = [ "a", "b", "c", "d", "e" ];

// delete ar1[2];
// const ar2 = [ ...ar1 ];

// console.info( 'ar2 : ', ar2 );



