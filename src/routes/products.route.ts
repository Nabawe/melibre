import { Router } from "express";
import type { Request, Response } from "express";
import { fileURLToPath } from 'node:url';
import RAMBox from "../classes/RAMBox.js";

import type { t_Verdicts, t_resType } from "../data/verdicts.js";
import Verdicts from "../data/verdicts.js";


// Merchandise Manager
const MerchMan = new RAMBox(
    'products.json',
    fileURLToPath( new URL( '../data/', import.meta.url ) )
);
const Route_Products = Router();

function f_renderProductsTable( res: Response ) {
    return res.render(
        'Products_Table',
        { 'Products': MerchMan.i, 'title': 'Austral Interpretar : Products' }
    );
};

// ! Careful overusing this function since each RAMBox method might need special handling.
/* * The use of try catch statements might be a more typical sollution, specially since RAMBox methods return errors when they fail */
function f_handleSimpleRAMBoxError( res: Response, result: unknown ) {
    if ( result instanceof Error ) {
        const v = Verdicts[ ( result.cause as keyof t_Verdicts ) ];
        return res.status( v.status )[ ( v.type as t_resType ) ]( v.outcome );
    };
    return false;
};

Route_Products.get( '/products', ( _, res: Response ) => {
    f_renderProductsTable( res );
} );

/* Example
    fetch('http://localhost:8080/products/del/d89Jbwvb4EFpBE26g7KNt', { method: 'DELETE' })
*/
// * the /del was added as extra insurance.
/* Commented out since it could block the more useful /products/del, didn't test though
    Route_Products.delete( '/products/del/:id', ( req: Request, res: Response ) => {
        const match = MerchMan.m_del( req.params.id );
        return (
            f_handleSimpleRAMBoxError( res, match )
            || f_renderProductsTable( res )
        );
    } );
*/

Route_Products.post( '/products/del', ( req: Request, res: Response ) => {
    const match = MerchMan.m_del( req.body.id );
    return (
        f_handleSimpleRAMBoxError( res, match )
        || res.status( 200 ).json( match )
    );
} );

Route_Products.post( '/products/add', ( req: Request, res: Response ) => {
    // ! HERE BEFORE SENDING req.body there should be somekind of check that confirm the integrity of the data from the front
        // !!! The problem with the class checking extra things appart from basic data existance, storage, is that every case will have different kinds of items
        // * to sum up here check what the front has emited, then the class #dataChecks, ensures non empty, storage and other fundamentals.
        // WIP todo esto es un problema de mala division de tareas, tampoco tendria q ser encesario pasar las extra props, sino q la clase solo lidie con lo generico y fundamental
    // const match = MerchMan.m_new( req.body );
    // if ( match instanceof Error ) {
    //     const v = Verdicts[match.cause];
    //     return res.status( v.status )[v.type]( v.outcome );
    // };
    // res.render( 'Products_Table', { 'Products': MerchMan.i, 'title': 'Austral Interpretar : Products' } );
    return (
        f_handleSimpleRAMBoxError( res, MerchMan.m_new( req.body ) )
        || f_renderProductsTable( res )
    );
} );

/* * remember URL escape codes AKAs "percent-encoding", "URL encoding"
    http://localhost:8080/products/f?field=dateCreated&operator=%3D%3D%3D&value=1655604430649
    http://localhost:8080/products/f?field=price&operator=%3C%3D&value=300
    http://localhost:8080/products/f?field=price&operator=<%3D&value=300
*/
Route_Products.get( '/products/f', ( req: Request, res: Response ) => {
    const { field, operator, value } = req.query;
    // ! Front and Security Checks, "sanitisation"
    // ( remove the "as string" since the checks will give type assurance )
    const match = MerchMan.m_filter( field as string, operator as string, value as string );

    return (
        f_handleSimpleRAMBoxError( res, match )
        || res.render(
            'Products_Table',
            { 'Products': match, 'title': 'Austral Interpretar : Products' }
        )
    );
} );

/* * No permite actualizar el id de forma manual, de necesitarlo borrar el producto y re agregarlo, así garantiza el uso correcto de UUID */
// ! Pork no puedo poner put aquí y q el form lo indique
// ! Posee los mismos problemas sobre el checkeo d lo q viene del front q /products/add
Route_Products.post( '/products/update', ( req: Request, res: Response ) => {
    /* remove required from Title, Price, Thumbnail in Products_InputForm.handlebars, only ID should be required, the datachecks should prevent problems like an empty field saving an empty datum */
    return (
        f_handleSimpleRAMBoxError( res, MerchMan.m_set( req.body.id, req.body ) )
        || f_renderProductsTable( res )
    );
} );

// WIP Think what would be a better return
Route_Products.post( '/products/save', ( _, res: Response ) => {
    return (
        f_handleSimpleRAMBoxError( res, MerchMan.m_fileSave() )
        || res.status( 200 ).json( MerchMan.i )
    );
} );

// WIP Think what would be a better return
Route_Products.post( '/products/reset', ( _, res: Response ) => {
    return (
        f_handleSimpleRAMBoxError( res, MerchMan.m_fileReset() )
        || res.status( 200 ).json( MerchMan.i )
    );
} );

Route_Products.get( '/products/:id', ( req: Request, res: Response ) => {
    const match = MerchMan.m_getById( req.params.id );
    return (
        f_handleSimpleRAMBoxError( res, match )
        || res.render(
            'Products_Table',
            { 'Products': [match], 'title': 'Austral Interpretar : Products' }
        )
    );
} );

/* * Remember that the more general a route the lower in the file it should be as not to obstruct others. */
Route_Products.get( '/', ( _, res: Response ) => {
    res.render( 'Products_InputForm', { 'title': 'Austral Interpretar : Inicio' } );
} );


// ! Hacer q cada tanto se graben en un archivo, usando timer o cada vez q termina una operación -> Peligro si es ASYNC
// ! Crear JSONBoxRAMCached, q use UUID y agregar timestamp creted, timestamp mod, si se mod o crea se agrega o re agrega al final del array ( borra y agrega )
    //  q tenga una funcion save o commitToDisk para elegir cuando se guarda en disco y pedir ayuda como diceñar y o investigar (la cola de escritura, etc)
    // en vez de tener el import en la ruta de los productos se initializa la instancia de la clase con ese archivo y ahi se hace la validacion del mismo y carga a RAM
// ! revisar como esta redactada la pregunta de append a ver si es lo mismo q leer, sacar, y reescribir todo? parcial?
// To-Do Mover nanoid a lo q lo use, modificar package.json
// ! Frenar el cambio de pagina del submit


export default Route_Products;

/* To-Do
    - Pensar si hacer lo siguiente
        m_isValidField( field: string ) {
            return field in o_ValidFields;
        };

        Al crear nuevos items se checkea si poceen fields nuevos y se los agregan a la lista de valid fields

        Conciderar si este checkeo en realidad tendria q pasar en el front primero

        Conciderar cuanto y como hay q validar field: string, operator: t_Comparison, value: any

    - Repasar q Types se tienen q exportar de RAMBox e importar en las rutas

    - Agregar una query
        · Para eso agregar la posibilidad de buscar por dateCreated y Price

    - Ver los otros metodos https://claude.ai/chat/b4c2e582-0b8b-4708-a1e9-74caa596a5a9

    + Add to RAMBox getByDateCreated & dateMod

    + New classes
        RAMBox-Query extends RAMBox for simple querying
            Esta creo q puede ir dentro de rambox normal y tener un checkeo q revisa si existe el campo

        RAMBox-ColonQuery to be able to query like scryfall

        RAMBox- aiQuery similarQuery lazyQuery


    + Each class Should create a new dir to store assetss
        - Bajo este principio reestructurar los errores y usar imports para armar jerarquía
        ! Y agregar los nuevos errores para los nuevos metodos
        ? Escribir sobre pork no success: true | false , o sea en vez de success with errors directamente como hubo un error q el mecanismo de errores lo trate? es algo para al menos dejar bien escrito el pensamiento y los fundamentos p cada lado.


    + Add the two last pinned conversations with Claude to .docs
*/

/* To-Do
    Database > Async > GraphQL > Svelt
*/

/* WIP
    Query(id, date, body) > QueryHandler(process the response based on domain) > Results(id, date, ...content) > ResultsHandler()
    Does query need to separate the domain from the queryBody?
    Lo q estoy intentando decir es q voy a necesitar una instancia de RAMBox para las Queries y otra para los Resultados de las mismas.

    A page with the lists of queries linking to their results.
*/
