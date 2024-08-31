/*
+ // * Reminder to Self
+ Intro
+ Observations
+ Code Notes
+ Conclusion

+ TO-DO
+ SOURCES


+ // * Reminder to Self : Members = Properties or Methods


+ Intro
    This code came about as a self imposed excersice to manupulate and add a new item to an array of items ( collection ). The constrains were :
        1 - The characteristics of the new item properties will be unknown.
        2 - Do not use loops.

    I wanted to create a mechanism that used destructuring for precision and speed and that's what's explored here.
+


+ Observations
    - In the case of processing a new item from req.body before adding it to a collection, the extra checks that verify the data integrity should happen before passing it to the class managing the database, etc. I don't know if extra redundancies are needed or how much a database schema and other tecniques can do. May be some of those should happen at a development step and not during runtime ( to make sure the data formats match, etc ).

    - The placement of the innermost " ${[ ...Props ]} " allows to overwrite properties, this could be intentional but in all examples " ${[ ...Props ]} " is placed so that id and dateCrated can not be overwriten if id or dateCreated are specified by the new item.

    - I made some experiments with the .bind method for the new Function statement but could not make it work, I believe there isn't anything worth there, all experiments here seam cleaner.

    - There might be important security risks to concider since all the approaches here use something similar to eval or assert but in a more controlled way.

    - The first example is forced to pass Accumulator, f_makeUUID on each use but the extructure is far simpler, the complexity of the other examples grows by the fact that the dynamically generated functions are not aware of their enviroment ( I believe they can only access global, but it is not completly clear to me what happens ).
+


+ Code Notes
    - const functionParams = `{ ${[ ...Props ]} }, Container, f_UUIDGen`;
        Here inside the litteral the first {} pair corresponds to the destructuring parameters.
        The second ${} is to write exactly which members will be extracted.
        And the last one is a destructuring of the array containing what to extract.
        To clarify two destructuring processes are happening:
            · One comes from the array with the parameters to write to the litteral.
            · The other will happen on runtime from the resulting function the moment it receives the new item object.
        The resulting function in the exaplles would then have look like:
            const functionParams = `{ are, name}, Container, f_UUIDGen`;

    - About Closures and Double Nested or Binded Functions:
        Check Example B

        const functionParams = `{ ${[ ...Props ]} }`;
        const functionBody = `
            return function( ${functionParams} ) {
                Container.push( {
                    ${[ ...Props ]},
                    id: f_UUIDGen(),
                    dateCreated: Date.now(),
                } );
            };
        `;
        return new Function( 'Container', 'f_UUIDGen', functionBody )( Container, f_UUIDGen );

        The layers here from outside to inside :
            1 - The last line creates a function using the string functionBody and enables access to the external variables Container and f_UUIGen ( specified as for its names as strings ). ( The return does not happen yet ! ).
            2 - The second pair of parentesis inmediatly invokes the previous function creating a closure that freezes the values of Container and f_UUIDGen like pointers to be invoked latter.
            The return INSIDE the string functionBody is triggered and returns a function that has the specified parameters so that in a future it can properly use destructuring.
            3 - The return in the LAST LINE is triggered and the finished product is returned and ready to receive an new item as an object.
+


+ Conclusion
    Even though all the exploration was worth it in reality one should be able to directly add req.body to the collection provided the frontend and server checked the integrity and validity of the data.
+
*/

import { nanoid as f_makeUUID } from 'nanoid';

const Thing1 = {
    id: 123,
    age: 4,
    name: "Asad d Dasad",
};
const Thing2 = {
    id: 456,
    age: 7,
    name: "Firulais",
};

const MembersToManipulate = [ "age", "name" ];
const Accumulator: Object[] = [];

/* * Example A
    function f_createSpecializedPusher( Props: string[] ) {
        const functionParams = `{ ${[ ...Props ]} }, Container, f_UUIDGen`;
        const functionBody = `
            Container.push( {
                ${[ ...Props ]},
                id: f_UUIDGen(),
                dateCreated: Date.now(),
            } );
        `;

        return new Function( functionParams, functionBody );
    };

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate );
    f_specializedPusher( Thing1, Accumulator, f_makeUUID );
    f_specializedPusher( Thing2, Accumulator, f_makeUUID );
*/


/* * Example B
    function f_createSpecializedPusher( Props: string[], Container: Object[], f_UUIDGen: ( size?: number ) => string ) {
            const functionParams = `{ ${[ ...Props ]} }`;
            const functionBody = `
                return function( ${functionParams} ) {
                    Container.push( {
                        ${[ ...Props ]},
                        id: f_UUIDGen(),
                        dateCreated: Date.now(),
                    } );
                };
            `;

            return new Function( 'Container', 'f_UUIDGen', functionBody )( Container, f_UUIDGen );
        };

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate, Accumulator, f_makeUUID );
    f_specializedPusher( Thing1 );
    f_specializedPusher( Thing2 );
*/


/* * The code that follows is just used to show the working priciple of the next one
    function f_createSpecializedPusher( Props: string[] ) {
        const functionParams = `{ ${[ ...Props ]} }, Container, f_UUIDGen`;
        const functionBody = `
            Container.push( {
                ${[ ...Props ]},
                id: f_UUIDGen(),
                dateCreated: Date.now(),
            } );
        `;

        return new Function( functionParams, functionBody );
    };

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate );
    const f_bind = ( NewItem: Object ) => f_specializedPusher( NewItem, Accumulator, f_makeUUID );
    f_bind( Thing1 );
    f_bind( Thing2 );
*/


/* * Example C */
    function f_createSpecializedPusher(
            Props: string[],
            Container: Object[],
            f_UUIDGen: ( size?: number ) => string
        ): ( NewItem: Object ) => void {

        // the typing of the return value should be something like ( ...Props: any ) => void
        // which is quite pointless since the quantity and values are unkown
        // there might be an overcomplicated way to do it
        const f_SpecializedPusher = ( Props: string[] ) => {
            const functionParams = `{ ${[ ...Props ]} }, Container, f_UUIDGen`;
            const functionBody = `
                Container.push( {
                    ${[ ...Props ]},
                    id: f_UUIDGen(),
                    dateCreated: Date.now(),
                } );
            `;

            return new Function( functionParams, functionBody );
        };

        const f = f_SpecializedPusher( MembersToManipulate );
        const f_bindedToContext = ( NewItem: Object ) => f( NewItem, Accumulator, f_makeUUID );

        return f_bindedToContext;
    };

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate, Accumulator, f_makeUUID );
    f_specializedPusher( Thing1 );
    f_specializedPusher( Thing2 );
/*  */


    console.info( Accumulator );
    /* * the evidence that it works is in that the ids are different and the dateCreated dynamic, by that I mean that f_UUIDGen is a pointer and not a function that was ran once returning a single id. Furthermore one can see that Container is actually accessed */


/* + TO-DO
    - Falta agregarle el tipado a ${[ ...Props ]} dentro de los literales
        Seria algo asi como:
            type t_PropsArray = [ [ key: number ]: any ];
        o
            ${[ ...Props ]: any[] }

    - Ask AI of a cleaner way to write the following, may be using generics?
        A lo q me refiero es q creo q hay forma de tipar los argumentos de una funcion usando generics, no se q es mas inteligente d usar aun.
        function f_createSpecializedPusher(
            Props: string[],
            Container: Object[],
            f_UUIDGen: ( size?: number ) => string
        ):
            ( NewItem: Object ) => void
        { ...........

    - Add function return types
    - Name each strategy and compare them
+ */


/* + SOURCES
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dynamic_and_weak_typing

    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function

    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_function_calls

    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

    - " Destructuring Object Arguments in TypeScript, with out loops or previous knowledge "
        https://claude.ai/chat/68c0b603-35ce-44b1-ae73-f299f9d2636c
+ */
