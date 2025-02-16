type h_MapValueType<T> = T extends Map<any, infer V> ? V : never;
type h_MapKeyType<T> = T extends Map<infer K, any> ? K : never;

type t_Key = string | number | symbol;
type t_IddirKey = h_MapKeyType< c_TidyTree['Iddir'] >;
type t_IddirValue = h_MapValueType< c_TidyTree['Iddir'] >;

/* I need the interfaces else, TS just breaks and can't do the typing for an annonymus class, and even with "implements", "type casting", "satisfies" I am forced to DUPLICATE ALL TYPING in the interfaces and in the classes */
interface t_TidyBranch {
    layout: t_IddirValue[];
    positions: Map< t_IddirKey, number >;
    readonly id: t_IddirKey;
    level?: number;
    parent?: t_TidyBranch | null;
    data?: any;

    // methods
    readonly size: number;
    readonly length: number;
};
interface t_TidyBranchConstructor {
    new (
        id: t_IddirKey,
        level?: number,
        parent?: t_TidyBranch | null,
        data?: any,
    ): t_TidyBranch;
    hostTree: c_TidyTree;
};

class c_TidyTree {
    protected static treesCount = 0;

    // might change it to protected or private
    /* ! I think t_TidyBranch might need a better definition, getters props are missing, I don't know if I need to include hostTree since it is a prop for the class and not the instance */
    // public c_TidyBranch = class implements t_TidyBranch {
    // public c_TidyBranch: typeof this['c_TidyBranch'] = class implements t_TidyBranch {
    // public c_TidyBranch: typeof this['c_TidyBranch'] = class {
            /* even if it looks silly it works but the IntelliSense gets cooked and shows everything in its dictionary, in essense functinally disabled but though checks for errors */
    public c_TidyBranch: t_TidyBranchConstructor = class implements t_TidyBranch {
        public static hostTree: c_TidyTree;
        public layout: t_IddirValue[] = [];
        public positions: Map< t_IddirKey, number > = new Map();
        /** @param {c_TidyBranch} [parent] - Must be specified for all branches except Root. The property was set as optional since Root would have no parent to be assigned to. */
        constructor(
            public readonly id: t_IddirKey,
            public level?: number,
            public parent?: t_TidyBranch | null,
            public data?: any ) {
        };
        get size() {
            return this.positions.size;
        };
        get length() {
            return this.layout.length;
        };
    };
    // type assertion experiment to avoid duplicate typing
    // } as t_TidyBranchConstructor;

    // if this doesn't work add in the constructor this.id = ++c_TidyTree.treesCount;
    public id = ++c_TidyTree.treesCount;
    public Iddir: Map<number, t_TidyBranch> = new Map();
    public lastId = 0;
    public Root = new this.c_TidyBranch( 0, 0, null );
    protected seq = { currentBranch: this.Root, prevBranch: this.Root };
    constructor() {
        /* may be there is a way to add this line in the class declaration, but need to be careful to what 'this' points to. */
        this.c_TidyBranch.hostTree = this;
    };

    m_genId() {
        return ++this.lastId;
    };

    // m_get( id: c_TidyTree['c_TidyBranch']['id'] ) {
    m_get( id: t_TidyBranch['id'] ) {
        return this.Iddir.get( id );
    };

    m_link( parent: t_TidyBranch, pointer: t_TidyBranch ) {
        parent.positions.set( pointer.id, parent.layout.length );
        parent.layout.push( pointer );
        pointer.parent = parent;
        // pointer.level = ( parent.level ?? 0 ) + 1;
        // pointer.level = parent.level + 1;
        pointer.level = parent.level! + 1;
    };

    m_sprout( parent = this.Root, data: any ) {
        const id = this.m_genId();
        const newBranch = new this.c_TidyBranch( id, undefined, undefined, data );
        this.Iddir.set( id, newBranch );
        this.m_link( parent, newBranch );
        return newBranch;
    };
};

const TreeA = new c_TidyTree();
const TreeB = new c_TidyTree();
const TreeC = new c_TidyTree();

TreeA.m_sprout( undefined, 'A1' );
TreeA.m_sprout( undefined, 'A2' );

TreeB.m_sprout( undefined, 'B1' );
TreeB.m_sprout( undefined, 'B2' );

TreeC.m_sprout( undefined, 'C1' );
TreeC.m_sprout( undefined, 'C2' );

console.log( '______________________________' );
console.log( TreeA.c_TidyBranch.hostTree.id );

console.log( '______________________________' );
console.log( TreeB.c_TidyBranch.hostTree.id );

console.log( '______________________________' );
console.log( TreeC.c_TidyBranch.hostTree.id );

console.log( '______________________________' );
console.log( 'Instance Test is A in and off A', ( TreeA.Root.layout[1] instanceof TreeA.c_TidyBranch ) );
console.log( 'Instance Test is B in and off A', ( TreeB.Root.layout[1] instanceof TreeA.c_TidyBranch ) );

console.log( '______________________________' );
console.log( 'Branch Structure Test' );
console.dir( TreeA.Root.layout[1], { depth: null } );


