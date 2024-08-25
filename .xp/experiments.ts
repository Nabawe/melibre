import { nanoid as f_makeUUID } from 'nanoid';

// ! PENSAR DE CERO COMO HACERLO como seria agregar propierdades, como es todo el proceso desde q se recive el objeto, es necesario hacer destructuring? no se le puede agregar lo nuevo a objeto referenciado por el parametro y luego hacer el push al array?
    // ! COMO ACOTAR lo q no se quiere del objeto q se recive es el problema
    /*
        function extraction( newItem ) {
            for i
                newItem[ newProp[ i ] ] = newValue[ i ];
                // ... make it a loop for each newProp and Value?
            // ! Sigue estando el problema de si sobran cosas del new item q viene de req.body
        };
    */
    /* ! Careful if the props overlap with the default ones they will be overwriten this is controlled by the placement of " ${[ ...Props ]} " in the returned function's body */
    const Selected = [ "age", "name" ];

    const Subject1 = {
        id: 123,
        age: 4,
        name: "Asad d Dasad",
    };

    const Home: Object[] = [];

    function MakerOfExtractors( Props: string[] ) {
        const destructuringParams = `{ ${[ ...Props ]} }, Container, f_UUIDGen`; // ! Explain the literal's layers
        /* ! La siguiente linea "age, name"
            Termina no teniendo sentido pork lo correcto sería ${[ ...Props ]} q se puede hacer perfectamente sin todo esto ya q sino hay q conocer de ante mano las propiedades a agregar
        */
        const functionBody = `
            Container.push( {
                id: f_UUIDGen(),
                dateCreated: Date.now(),
                ${[ ...Props ]}
            } );
        `;

        return new Function( destructuringParams, functionBody );
    };

    const extracted = MakerOfExtractors( Selected );
    extracted( Subject1, Home, f_makeUUID );

    console.info( Home );

