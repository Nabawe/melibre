type h_MapValueType<T> = T extends Map<any, infer V> ? V : never;
type h_MapKeyType<T> = T extends Map<infer K, any> ? K : never;

type t_Key = string | number | symbol;
type t_IddirKey = h_MapKeyType< c_TidyTree['Iddir'] >;
type t_IddirValue = h_MapValueType< c_TidyTree['Iddir'] >;


class c_TidyTree {
    protected static treesCount = 0;

    // might change it to protected or private
    public c_TidyBranch = class {
        public static hostTree: c_TidyTree;
        public layout: t_IddirValue[] = [];
        public positions: Map< t_IddirKey, number > = new Map();
        /** @param {c_TidyBranch} [parent] - Must be specified for all branches except Root. The property was set as optional since Root would have no parent to be assigned to. */
        constructor(
            public readonly id: t_IddirKey,
            public level?: number,
            public parent?: c_TidyTree['c_TidyBranch'] | null,
            public data?: any ) {
        };
        get size() {
            return this.positions.size;
        };
        get length() {
            return this.layout.length;
        };
    };

    // if this doesn't work add in the constructor this.id = ++c_TidyTree.treesCount;
    public id = ++c_TidyTree.treesCount;
    public Iddir: Map<number, this['c_TidyBranch']> = new Map();
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
    m_get( id: this['c_TidyBranch']['id'] ) {
        return this.Iddir.get( id );
    };

    m_link( parent: this['c_TidyBranch'], pointer: this['c_TidyBranch'] ) {
        parent.positions.set( pointer.id, parent.layout.length );
        parent.layout.push( pointer );
        pointer.parent = parent;
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


