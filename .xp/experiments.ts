import { nanoid as f_makeUUID } from 'nanoid';
/* !
    Sigue estando el problema de si sobran cosas del new item q viene de req.body ( o sea si no se filtra o usa destructuring el problema puede aparecer al costo de más redundancias ).
    Esto no deberia ser un problema ya q el checkeo tendria q estar serverside pero antes de q RAMBox lo resiva, o sea RAMBox no tiene q chekear si los datos estan bien o si sobra algo, sino q usar todo lo q se le pase, por eso no es necesario el destructuring sino q solo usar todo el req.body, mas checkeos serian mas redundancias y eso tendria q venir por la parte de verificacion de datos.
    ! O realmente sería lo correcto q aparte del front y el server, la clase revise el formato e integridad de la data antes de agregarla al array? no hace un proceso similar la base de datos con los schema y demas?
*/
/* !
    Careful with duplicated props, they will get overwriten. This is controlled by the placement of " ${[ ...Props ]} " in the returned function's body.
    Example add id to the MembersToManipulate constant then the UUID value for the id will be overwriten by the oldone if " ${[ ...Props ]} " is at the end of the functionBody constant.
*/
// Members = Properties or Methods

/*
    // * The f_createSpecializedPusher function can be written in different ways, Container and f_UUIDGen can be alternatively passed to the resulting function and in either case the new Function .bind method can be used too, I am unsure of the security risks.
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

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate );
    f_specializedPusher( Thing1, Accumulator, f_makeUUID );
    f_specializedPusher( Thing2, Accumulator, f_makeUUID );

    console.info( Accumulator );
*/


/*
    function f_createSpecializedPusher( Props: string[], Container: Object[], f_UUIDGen: ( size?: number ) => string ) {
            // ! Explain the literal's layers
            const functionParams = `{ ${[ ...Props ]} }`;
            // ! Explain the closure and why is needed
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

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate, Accumulator, f_makeUUID );
    f_specializedPusher( Thing1 );
    f_specializedPusher( Thing2 );

    console.info( Accumulator );
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

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate );
    const f_bind = ( Target: Object ) => f_specializedPusher( Target, Accumulator, f_makeUUID );
    f_bind( Thing1 );
    f_bind( Thing2 );

    console.info( Accumulator );
*/


    function f_createSpecializedPusher(
            Props: string[],
            Container: Object[],
            f_UUIDGen: ( size?: number ) => string
        ): ( Target: Object ) => void {

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
        const f_bindedToContext = ( Target: Object ) => f( Target, Accumulator, f_makeUUID );

        return f_bindedToContext;
    };

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

    const f_specializedPusher = f_createSpecializedPusher( MembersToManipulate, Accumulator, f_makeUUID );
    f_specializedPusher( Thing1 );
    f_specializedPusher( Thing2 );

    console.info( Accumulator );




    // Redactar todo mejor, borrar el muro de texto, dejar claros los 2 ejemplos de las 2 formas, dejar el link al metodo .bind, ver si se puede usar sin .bind
    // Mover a una nueva carpeta llamada algo asi como .NiceCode, buscar mejor nombre
    /* Redactar mejor y mas compacto el punto sobre la posicion de ${[ ...Props ]} en
        Container.push( {
            id: f_UUIDGen(),
            dateCreated: Date.now(),
            ${[ ...Props ]}
        } );

        Explicar q hay props q no deben ser alteradas y si se lo decea hacer tendria q ser en un metodo tipo mod o etc y no requeriria todo el quilombo para el filtrado.
    */
    /* Probar hacer el bind afuera de la faktory function, tomando la linea del primer ejemplo
        No estoy seguro bien como seria si usando bind, closure o q, y tener cuidado q no se loquee el mismo resultado de f_makeUUID o sea q se pase la funsion
        const bind = f_specializedPusher( Thing1, Accumulator, f_makeUUID );
        const bind = f_specializedPusher( Thing1 )( Accumulator, f_makeUUID );
        const bind = f_specializedPusher.bind( Accumulator, f_makeUUID );

        bind( Thing1 );
    */
    /* Falta agregarle el tipado a ${[ ...Props ]} dentro de los literales
        Seria algo asi como:
            type t_PropsArray = [ [ key: number ]: any ];
        o
            ${[ ...Props ]: any[] }
    */
    /* Ask AI of a cleaner way to write the following, may be using generics?
        function f_createSpecializedPusher(
            Props: string[],
            Container: Object[],
            f_UUIDGen: ( size?: number ) => string
        ):
            ( Target: Object ) => void
        {
    */
    /*
        Ask AI which of the last 2 are better
   */
