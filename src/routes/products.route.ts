import { Router } from "express";
import type { Request, Response } from "express";
import { fileURLToPath } from 'node:url';
import RAMBox from "../classes/RAMBox.js";

import type { t_Verdicts } from "../data/verdicts.js";
import Verdicts from "../data/verdicts.js";


const MerchMan = new RAMBox( 'products.json', fileURLToPath( new URL( '../data/', import.meta.url ) ) );
const Route_Products = Router();


Route_Products.get( '/products', ( _, res: Response ) => {
    res.render( 'Products_Table', { 'Products': MerchMan.i, 'title': 'Austral Interpretar : Products' } );
} );

Route_Products.post( '/products/del', ( req: Request, res: Response ) => {
    const match = MerchMan.m_del( req.body.id );
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[v.type]( v.outcome );
    };
    res.status( 200 ).json( match );

    // ( return f_RAMBoxRun || res.status )
    // return ( f_RAMBoxRun || res.status )
    /*
        ? What happens when if you try
        return res.status ?
        in theory a route does not return anything or into anything or does this halt the server?
        Understand Route_Products and .post
        ? Or is there another way to use return, another way to cut the excecution, throw was concidered a bad practise? and it should not stop the server for an error
        * again it seams to be key to understand what happens to the excecution when " return res.status( v.status )[v.type]( v.outcome ); " returns the error
        ? use some sophistry with a temporal function or a special nesting of code blocks {} ? Wouldn't all that be just like an if?
        ? What exactly do {} on JavaScript or TypeScript when used as operators? Flow Control or just scope?
    */
} );

Route_Products.post( '/products/add', ( req, res ) => {
    // ! HERE BEFORE SENDING req.body there should be somekind of check that confirm the integrity of the data from the front
        // !!! The problem with the class checking extra things appart from basic data existance, storage, is that every case will have different kinds of items
        // * to sum up here check what the front has emited, then the class #dataChecks, ensures non empty, storage and other fundamentals.
        // WIP todo esto es un problema de mala division de tareas, tampoco tendria q ser encesario pasar las extra props, sino q la clase solo lidie con lo generico y fundamental
    const match = MerchMan.m_new( req.body );
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[v.type]( v.outcome );
    };
    res.render( 'Products_Table', { 'Products': MerchMan.i, 'title': 'Austral Interpretar : Products' } );
} );

/* * No permite actualizar el id de forma manual, de necesitarlo borrar el producto y re agregarlo, así garantiza el uso correcto de UUID */
// ! Pork no puedo poner put aquí y q el form lo indique
// ! Posee los mismos problemas sobre el checkeo d lo q viene del front q /products/add
Route_Products.post( '/products/update', ( req, res ) => {
    /* remove required from Title, Price, Thumbnail in Products_InputForm.handlebars, only ID should be required, the datachecks should prevent problems like an empty field saving an empty datum */
    const match = MerchMan.m_set( req.body.id, req.body );
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[v.type]( v.outcome );
    };
    res.render( 'Products_Table', { 'Products': MerchMan.i, 'title': 'Austral Interpretar : Products' } );
} );

Route_Products.get( '/', ( req, res ) => {
    res.render( 'Products_InputForm', { 'title': 'Austral Interpretar : Inicio' } );
} );

// WIP Pensar q sería mejor retornar
Route_Products.post( '/products/save', ( req, res ) => {
    const result = MerchMan.m_fileSave();
    if ( result instanceof Error ) {
        const v = Verdicts[result.cause];
        return res.status( v.status )[v.type]( v.outcome );
    };
    res.status( 200 ).json( MerchMan.i );
} );

// WIP Pensar q sería mejor retornar
Route_Products.post( '/products/reset', ( req, res ) => {
    const result = MerchMan.m_fileReset();
    if ( result instanceof Error ) {
        const v = Verdicts[result.cause];
        return res.status( v.status )[v.type]( v.outcome );
    };
    res.status( 200 ).json( MerchMan.i );
} );
// ! Hacer q cada tanto se graben en un archivo, usando timer o cada vez q termina una operación -> Peligro si es ASYNC
// ! Crear JSONBoxRAMCached, q use UUID y agregar timestamp creted, timestamp mod, si se mod o crea se agrega o re agrega al final del array ( borra y agrega )
    //  q tenga una funcion save o commitToDisk para elegir cuando se guarda en disco y pedir ayuda como diceñar y o investigar (la cola de escritura, etc)
    // en vez de tener el import en la ruta de los productos se initializa la instancia de la clase con ese archivo y ahi se hace la validacion del mismo y carga a RAM
// ! revisar como esta redactada la pregunta de append a ver si es lo mismo q leer, sacar, y reescribir todo? parcial?
// To-Do Mover nanoid a lo q lo use, modificar package.json
// ! Frenar el cambio de pagina del submit




// Route_Products.post( '/products', ( req, res ) => {
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
