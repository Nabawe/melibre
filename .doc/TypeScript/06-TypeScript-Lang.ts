/*
    + CODEX
    + TERMS

    + Mantras

    + How to test and experiment

    + Primitive Types
    + Implicit Typing
    + Explicit Typing with :
    + type
    + Arrays
    + Tuples
    + enum
    + interface
    + // WIP type vs interface
    + Inline Type Annotation
    + Functions
    + Classes
    + Declaration Spaces
    + Namespaces
    + Generics
    + Modules
    + Function Overload
    + Declaration Files .d.ts and .ts

    + Last Words
    + Pros

    + QUESTIONS
    + TO-DO
    + AUXILIO
    + SOURCES
*/


/* + CODEX */ /*
    + Section
        - Subsection or Item
            · Subsection or Item
                * Subsection or Item (Free-form from this level downwards, try to avoid asterisk as it could have other uses)
                    <> Subsection or Item

    - Abbreviations:
        · TS    = TypeScript
        · JS    = JavaScript
        · TSC   = TypeScript Compiler
        · RN    = React Native

        · def   = definition
/* + CODEX */


/* + TERMS */ /*
    - Transpiler
        Source to source compiler. AKAs: source-to-source compiler, transcompiler
    - Literal
/* + TERMS */


/* + Mantras */ /*
    " you can incrementally upgrade your JavaScript code to TypeScript "

    " Type errors do not prevent JavaScript emit. To make it easy for you to migrate your JavaScript code to TypeScript, even if there are compilation errors, by default TypeScript will emit valid JavaScript the best that it can. "

    WIP add a Mantra about "keeping it simple", and how TS infers many things.
/* + Mantras */


/* + How to test and experiment */ /*
    WIP a section describing quick and fast ways to test what's described here, may reference to TypeScript-Setup.
    WIP and how-to use the comments in each section to test and make use of syntax highlightning. The importanse of the squigly lines and mouse hovering to understand the errors and debug.
/* + How to test and experiment */


/* + Primitive Types */ /*
    ! All Primitive Types are LOWERCASE, object is not the same as Object.
    ? Trying to make a list of the non-reduseable Types which are not the same as the Basic Types, but I do believe I need to research, clarify and rethink them.
    // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values
    // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview
    // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#literals
    // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

    JavaScript:
        bigint, boolean, null, number, object, string, symbol, undefined

        Some Docs put Object as a non JavaScript Primitive Value but rather as something that TypeScript extends.

    AND

    TypeScript:
        any, enum, never, tuple, unknown, void

    - any
        Mostly used when the type of a expression becomes too complicated or irrelevant.

        Assigning the "any" type will have the effect of turning type checking for that expression off.
        " any is compatible with any and all types in the type system. This means that anything can be assigned to it and it can be assigned to anything. " - TypeScrip Deep Dive, Basarat
        WIP Try to list good practice scenarios.

    WIP INCOMPLETE DEFINITIONS AND USABILITY strictNullChecks, null, undefined, never, unknown

    - void
        Specifies that a function does not have a return type.

        " https://www.typescriptlang.org/docs/handbook/2/functions.html#void
            It’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements.
            In JavaScript, a function that doesn’t return any value will implicitly return the value undefined. However, void and undefined are not the same thing in TypeScript.
        "
            Additional Clarification at https://www.typescriptlang.org/docs/handbook/2/functions.html#return-type-void

        function ASD( msg ): void {
            console.log( msg );
        };

    - number
        Can be separated by a _ to make more readable
        console.log( 123_345_1234_934 ); // 1233451234934

    - object, Object, {}
        https://stackoverflow.com/questions/49464634/difference-between-object-and-object-in-typescript

    - JavaScript built-in Objects, Properties, and Methods
        Array ; Date ; eval ; function ; hasOwnProperty ; Infinity ; isFinite ; isNaN ; isPrototypeOf ; length ; Math ; NaN ; name ; Number ; Object ; prototype ; String ; toString ; undefined ; valueOf

    - Need a Category
        RegExp
/* + Primitive Types */


/* + Implicit Typing */ /*
    When assigning an initial value to a variable TypeScript will try to guess its type.
    let lucky = 21; // TypeScript infers the number type.
    let lucky = 'Bufanda'; // TypeScript infers the string type.

    function pow( x, y ) {
        // TS infers the number type from the use of Math lib.
        // The type is not infered from the function parameters.
        // ? number should be the type of the f but what about the types of the parameters? are they infered? will the parameters type depend on the values they assume?
        return Math.pow( x, y );
    };
/* + Implicit Typing */


/* + Explicit Typing with : */ /*
    * For basic things is better to let TS infer it.
    let name: string;
    let name: string = 'Hi';

    * Insight : " Anything that is available in the Type Declaration Space can be used as a Type Annotation " - TypeScrip Deep Dive, Basarat
        The def of Type Declaration Space is soon below. This was just a formal statement.
/* + Explicit Typing with : */


/* + type */ /*
    PascalCase.
    To make simple compound validations.

    type Style = 'strong' | 'emphasis' | 21;
    let font: Style;

    font = 'something'; // Error
    font = 'strong';    // OK
/* + type */


/* + Arrays */ /*
    Suffix [] to the type annotation.
        const arry0: number[] = [ 1, 2 ];
        arry0.push( 'asd' );    // Error
        arry0.push( 912 );

        type alfanumArry = ( number | string )[];
        const arry1: alfanumArry = [ 1, "2", "5", 3 ];
/* + Arrays */


/* + Tuples */ /*
    Tuples are fixed sized Arrays.
    A ? is used to make the value optional, the type is still being checked.

    ! Tuples are transpiled into Arrays, so methods like "push" bypass TS checks and will add the values.

    type triValTuple = [ number, string?, boolean? ];
    const tuple0: triValTuple = [ 1, 123, 'asd' ];    // Error

    // Don't push values to Tuples they are meant to be fixed, i.e. constructed by literals.
    // As seen below values pushed into tuple0 are not being validated.
    // ? There might be a way for TS to warn about using such methods or when a tuple is being mod.
    tuple0.push(1);
    tuple0.push('44');
    tuple0.push(false);

    type triValTupleFixed = [ number, string, boolean ];
    const tuple1: triValTupleFixed = [ 1, 'asd', true ];
/* + Tuples */


/* + enum */ /*
    PascalCase.
    * Def : "Enumerated Type". It is a data type consisting of a fixed set of NAMED CONSTANTS.

    They generally have a small quantity of members.
    If unspecified enum members will be assigned numeric values which will be auto incremented by 1, starting at 0 by default.
    Adding const before enum outputs a more concise JS code and slightly more strict TS.
    Avoid treating them as objects, always access them using the Name.Member form.

    const enum Size {
        Small = -1,
        Medium,
        Large = 'SuperLongLong',
        XL,                                 // Error : Non numeric values forces manual init
    };

    console.log( 'Size :', Size.Medium );   // 0
    console.log( 'Size :', Size.XL );       // Error
/* + enum */


/* + interface */ /*
    - PascalCase.
    - Used to validate Objects that follow a same structure.
    - It's common practice to arrange them so that the properties are listed first and then the methods.
    - " key?: " Optional Member
    - " readonly key: " then it won't be possible to change the value of this Member.

    ? Parameters, args and return values of a function.
    WIP Investigate if there are more uses for interfaces.
    WIP readonly proper usage, specially to avoid over-use.

    // - Objects
        interface Person {
            first: string;
            readonly last: string;
            opt?: number;
            [ key: string ]: any;
                // This allows adding types to keys that are created on runtime.
                // ? So that 'fast' does not produce a TS error,
                // ? but this surely limits existence checks.
        };

        const person1: Person = {
            first: 'Jeff',
            last: 'Delaney',
        };

        const person2: Person = {
            first: 'Usain',
            last: 'Bolt',
            fast: true,
            opt: true,              // Error, even if optional it must be a number
        };

        person2.first   = 'Josh';   // Valid
        person2.last    = 'Smith';  // Error since last is a readonly property

    // * Insight : " Interfaces are the core way in TypeScript to compose multiple type annotations into a single named annotation " - TypeScrip Deep Dive, Basarat
/* + interface */


/* + Inline Type Annotation */ /*
    Are specified by the structure " : { TypeAnnotation } " .
    Used in one offs, saving the need to name a Type Annotation (in other words to consume a slot in the Type Declaration Space).
    [], readonly, :? apply here too ( See +interface ).

    const myConstruct: {
        first: string;
        second: string;
        third: string;
    } = {
        first: 'asd',
        second: 'asd',
        third: 'asd',
    };

    let myConstruct2: {
        first: string;
        second: string;
        third: string;
    };

    myConstruct2 = {
        first: 'asd',
        second: 'asd',
        third: 'asd',
    };
/* + Inline Type Annotation */


/* + Functions */ /*
    * Always specifying the function's return is concidered a good practise, to ensure different return values, for documentation, and to faster comprehend what it does.

    In this particular case the return type could most probably be infered until they add ** operand to strings xD.

    function Pow( x: number, y: number ): number {
        return x ** y;
    };
    console.log( Pow( 5, 2 ) );    // 25


    // Optional Parameters
    function optParams( arg1?: number ): number | void {
        if ( arg1 )
            return 2
    };
    console.log( optParams() );

    // Defining Function, Callbacks and Methods Signatures
    // WIP add about ( arg: Type ) => ReturnType from No BS TS, make use interface, type in examples
    // WIP I believe there is a way to specify some part of the functions types using generics
    // ? Is it possible to use ( arg: Type ) function ReturnType or something similar instead of the arrow notation for function Typing?
/* + Functions */


/* + Classes */ /*
    class Foo {
        x: number;
        constructor( x: number ) {
            this.x = x;
        };
    };

    //  is Equivalent to

    class TwinFoo {
        constructor ( public x: number ) {

        };
    };

    /* The short hand is adding an Access Modifier (public, private, etc.) in the constructor. */
    /* In the 1st example the type specification before the Constructor is still relevant since using a constructor is optional. */

    // !WIP Ver si esta info esta actualizada o si hay una forma mejor de hacerlo
    // ? Abstract Modifier
    /* ? Ver como se combinan los access modifiers public, private, protected con # ; ya q TS access modifiers supuestamente HACEN NADA en JS y JS ya tiene la funcionalidad, en especial ver si private se traduce a # */
    /* Una forma de crear props realmente privadas es usando Symbol Properties, tambien sino usando Object.defineProperty. Ya q de esta manera no son enumeradas por defecto y a menos q se tenga el Symbol exacto no se las puede acceder, al menos en teoria... ya q seguramente hay alguna forma de ver todas las props de un objeto aun las no enumeradas o brute-force search. Igual es mejor evitar esto y usar los metodos anteriores. Abria q ver q tan fiable es usando Symbol.for() */
/* + Classes */


/* + Declaration Spaces */ /*
    A scope space is shared between Types and Variables Declarations.

    - Type Declaration Space
        When using a Type definition the name it was assigned gets reserved in a scope:
            interface Bar {};
            type Bas = {};

        one could do:
            let foo: Bas;
        but could NOT do:
            let bar = Bar;

    - Variable Declaration Space
        It's populated by each declared variable:
            let meVar = 1;

        and they can not be used as Types:
            let newVar: meVar;

    - Classes
        A Class Definition is both:
            class Cool {
                constructor ( public x: number ) {
                    this.x = x;
                }
            };
            class Scrool {
                constructor ( public x: string ) {
                    this.x = x;
                }
            };
            let Miau: Cool;
            let Mia = Cool;
            const iMia = new Cool( 2 );
            Miau = new Cool( 4 ); // OK
            Miau = new Scrool( '4' ); // Error: Type 'Scrool' is not assignable to type 'Cool'.

    // WIP improve this section, list all known Type, Variable Spaces and other special cases like Classes
/* + Declaration Spaces */


/* + Namespaces */ /*
    * Insight : File Modules cover most of this functionality but " the pattern is still useful for logical grouping of a bunch of functions " - TypeScrip Deep Dive

    JS does not have Namespaces.
    Use ; to separate members.
    export to publish.
    Whats not exported becomes a private member.

    namespace nsCamelCase {
        const privateValue = "You can't access this outside the Ns";

        export const expression = 'Laralilala';

        export const anotherExpression = ( a: number, b: number ) => a + b;

        export namespace nestedNamespace {
            export function moonlightSonata() {
                return 'Beethoven';
            };
        };
    };

    console.log( nsCamelCase.expression );
    console.log( nsCamelCase.nestedNamespace.moonlightSonata() );


    // ? Check if this is correct: tsconfig:
        "baseURL": "src",               // To use NameSpaces
        "paths": {                      // ! Unique names
            "@nmyApp-nameSpace/*":     ["app/nameSpace/*"],
            "@nmyApp-shared/*":        ["app/shared/deeply/nested/*"],
            "@nmyApp-environments/*":  ["environments/*"],
        },
/* + Namespaces */


/* + Generics */ /*
    Generics add "Variable Typing", i.e. a way to specify types the moment it is going to be used or defined.
    <  > Syntax

    Add Examples with functions, interfaces */

    /* What would be passed to the Wrinkly Interfase as T MUST extend the Type Definition of an object with the format { name: string } */
    interface Wrinkly<T extends { name: string }> {
        id: number;
        author: string;
        data: T
    };

    const FallOfNumenor: Wrinkly<{ name: string, FstParagraph: string }> = {
        id: 123,
        author: 'J.R.R. Tolkien',
        data: {
            name: 'Fall of Númenor',
            FstParagraph: 'Lorem Ipsum'
        },
    };

    console.log( FallOfNumenor );

/* + Generics */


/* + Modules */ /*
    One can export or import types just like any variable:
        export type SomeType = {
            blue: string;
        };
    OR
        let myVar = 123;
        type mewType = {
            green: string;
        };
        export {
            myVar,
            mewType
        };

    - tsconfig.json:
        "target":,
        "module":,

    - Overturning dynamic lookup just for types
        https://basarat.gitbook.io/typescript/project/modules/external-modules#overturning-dynamic-lookup-just-for-types
        You can declare a module globally for your project by using declare module 'somePath' and then imports will resolve magically to that path

        // global.d.ts
            declare module 'foo' {
                // Some variable declarations
                export var bar: number; // sample
            }

        and then:

        // anyOtherTsFileInYourProject.ts
            import * as foo from 'foo';
            // TypeScript assumes (without doing any lookup) that
            // foo is {bar:number}

    - Use case: Ensure Import
        https://basarat.gitbook.io/typescript/project/modules/external-modules#use-case-ensure-import
        Sometimes you want to load a file just for the side effect (e.g. the module might register itself with some library like CodeMirror addons etc.). However, if you just do a import/require the transpiled JavaScript will not contain a dependency on the module and your module loader (e.g. webpack) might completely ignore the import. In such cases you can use a ensureImport variable to ensure that the compiled JavaScript takes a dependency on the module e.g.:
            ( FF: This is because if something isn't used after it goes thru Webpack it gets removed )
        import foo = require('./foo');
        import bar = require('./bar');
        import bas = require('./bas');
        const ensureImport: any =
            foo
            && bar
            && bas;
/* + Modules */


/* + Function Overload */ /*
    Overload Signature
    Implementation Signature
/* + Function Overload */


/* + Declaration Files .d.ts and .ts */ /*
    - Can only contain types definitions.
    - d.ts Declaration Files are generally used to add types JS files without the need to rewrite them, they are generally auto associated, by using the same name or as a separated @types/libName package generally with an index.d.ts (its own package.json would have something like "types": "index.d.ts").
    - .ts Declaration Files are used to split the typings from another .ts file, they need to be manually imported.


    // someName.d.ts
        export type Sum = {
            first: number;
            second: number;
        };

        export function nameOfTheFunctionToType( x: string, y: boolean ): number;

    // someName.js
        import { Sum, namnameOfTheFunctionToTypeeOf } from ''

    // To autogenerate Types Declaration Files
        tsc FILE --declaration

    // Check +TOOLS-Definitely Typed
/* + Declaration Files .d.ts and .ts */


/* + Last Words */ /*
    Some general considerations
        https://basarat.gitbook.io/typescript/recap
        Equality
        References
        Null vs. Undefined
            Something hasn't been initialized : undefined.
            Something is currently unavailable: null.
            if ( localVar != null ) // localVar is not null or undefined, mind is != and not !==
            if ( typeof someGlobal !== 'undefined' ) doSomething ;
        this
        Closure
        Number
            Number.isSafeInterger( num )
                - To check if num could be subject to binary to decimal rounding errors.
                ! " Whenever you use math for financial calculations use a library like big.js"
                ! " Do not use this lib for math used for UI or performance intensive purposes, charts, canvas, etc. "
                    I understand that JS already has incorporated this but a specialized lib my do the job better.
                - Use Number.isNaN( var ) to check if var is of type Number and NaN.
                - Use isNan( var ) to check if var coerces to NaN. It checks if var is not a number, so it could very well be any String, etc.
                * " Further intuition: Just like values bigger than Number.MAX_VALUE get clamped to INFINITY, values smaller than Number.MIN_VALUE get clamped to 0. "
        Truthy
/* + Last Words */


/* + Pros */ /*
    - Customized IntelliSense thru lib key in tsconfig.json
    - Combat JS Weirdness : So you can incrementally upgrade your JavaScript code to TypeScript
    - Equality checks as consequence of type and Interface ( from TypeScript Deep Dive chapter on Equality )
/* + Pros */


/* + QUESTIONS */ /*
    - What's the "name" of the colon operator in typescript? ( I mean the main operator the : ).
        type operator? typeS operator?

    - Declaration Spaces
        · Does Class Typing work by inference?

    - Interface
        · Alternative to [ key: string ]: any;
        · For functions, arrays

    - Specifying optional types, parameters with ?
        · How can they be both optional but type checked when specified, example in the +Array section.

    - Namespaces
        · Do the use of Namespaces have a big negative impact once transpiled into JS? Since they are turned into a mess of functions or objects.
            If I understood correctly it gets transpiled to an anonymous function that aggregates to an object.
        · Are all Namespaces global? Can we define scopes to them? ( Not by nesting a NS whiting a NS ).

    - Modules
        · " https://basarat.gitbook.io/typescript/project/modules/external-modules
            Import a file only for its side effect with a single import statement:
                import 'core-js'; // a common polyfill library
        "
                What does "for its side effect" mean?
        · https://basarat.gitbook.io/typescript/project/modules/external-modules#use-case-lazy-loading
            I believe it is based on the previous section BUT the code is common JS then if so the modules are always loaded since no transpilation occurred.
        · https://basarat.gitbook.io/typescript/project/modules/external-modules#use-case-breaking-circular-dependencies

    - Classes
        · Property Initialization outside Class Constructor.
            How reliable is it?; Is it still implemented?; Has this been implemented in JS?
/* + QUESTIONS */


/* + TO-DO */ /*
    Generics
    Abstract classes
    Data modifiers
    Optionals
    Function overloading
    Class Decorators
    Type utils
    Record
    readonly keyword ( It may apply to more than interfaces )
    ! Duck Principle
        In TypeScript because we really want it to be easy for JavaScript developers with a minimum cognitive overload, types are structural. This means that duck typing is a first class language construct.
    Mixins
    .d.ts
        Better way to type functions inside these files.
    /// <reference path=""> File References
    Ambient
    Treeshaking and Bundling
    sourceMaps what are they
    Parece q MUI tiene algunos problemas con typescript revisar https://mui.com/material-ui/guides/typescript/


    Preformatear testing
    Helps Documenting
    'tooling' google fullmeaing
    futuro del tipado de lenguajes
    dev error checking, entender sus limites correctamente
    Transpiled by default to target JS Ver
    Type
    Mutacion
    Docu
    Control null, undefined, NaN, etc
    ----showConfig add this flag to the building it could help to confirm the tsc cfg each time is run

    https://bobbyhadz.com/blog/typescript-add-property-to-object
    https://blog.logrocket.com/dynamically-assign-properties-object-typescript/
        Mirar para ver como agregar Typeo a propiedades o metodos q se agreguen LUEGO de su definicion o sea de forma dinamica.
            La respuesta q buscaba en realidad era extender la definicion
                https://blog.logrocket.com/extending-object-like-types-interfaces-typescript/

    https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next
    .eslintrc.cjs
    https://parceljs.org/features/dependency-resolution/#query-parameters

    http://typescript-react-primer.loyc.net/minification.html
        https://parceljs.org/features/production/
            Parcel hace minificacion al correr el build

    // ! No se si se vuelve una contradiccion q este usando la version "estable" de TS pero activando tood lo q pueda de la ultima nightly ver con cosas como NodeNext
/* + TO-DO */


/* + AUXILIO */ /*
/* + AUXILIO */


/* + SOURCES */ /*
    - Fireship - TypeScript - The Basics
        https://www.youtube.com/watch?v=ahCwqrYpIuM

    - TypeScript Deep Dive by Basarat Ali Syed
        https://basarat.gitbook.io/typescript/
/* + SOURCES */
