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

Route_Products.get( '/', ( _, res: Response ) => {
    res.render( 'Products_InputForm', { 'title': 'Austral Interpretar : Inicio' } );
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
// ! Hacer q cada tanto se graben en un archivo, usando timer o cada vez q termina una operación -> Peligro si es ASYNC
// ! Crear JSONBoxRAMCached, q use UUID y agregar timestamp creted, timestamp mod, si se mod o crea se agrega o re agrega al final del array ( borra y agrega )
    //  q tenga una funcion save o commitToDisk para elegir cuando se guarda en disco y pedir ayuda como diceñar y o investigar (la cola de escritura, etc)
    // en vez de tener el import en la ruta de los productos se initializa la instancia de la clase con ese archivo y ahi se hace la validacion del mismo y carga a RAM
// ! revisar como esta redactada la pregunta de append a ver si es lo mismo q leer, sacar, y reescribir todo? parcial?
// To-Do Mover nanoid a lo q lo use, modificar package.json
// ! Frenar el cambio de pagina del submit




// Route_Products.post( '/products', ( req: Request, res: Response ) => {
//     const { name, race, age } = req.body;
//     Products.push( { name, race, age } );
//     //res.status( 200 ).json( Products );
//     res.status( 200 ).end();
// } );

export default Route_Products;

/*
    GET '/api/productos' -> devuelve todos los productos.
    GET '/api/productos/:id' -> devuelve un producto según su id.
    POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
    PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
    DELETE '/api/productos/:id' -> elimina un producto según su id.
    - Agregar una query
*/
