import { Router } from "express";
import { fileURLToPath } from 'node:url';
import RAMBox from "../models/RAMBox.js";
// import Verdicts from "../data/verdicts.js";
import Verdicts from "../data/verdicts.js?context=shops";
    // Did I really make a mistake here or is it too complex or new for TS to understand it?


const ShopsMan = new RAMBox( 'shops.json', fileURLToPath( new URL( '../data/', import.meta.url ) ) );
const Route_Shops = Router();


// f_tryOperation should be in index and not in each route
// res shouldn't use type any, it should be Express.Response or Response but it gives me errors
// ? Should I put customOutput = match in a new line?
function f_tryOperation( res: any, match: object[] | boolean | Error, customOutput = match ): any {
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[ v.type ]( v.outcome );
    };
    return res.status( 200 ).json( customOutput );
};


Route_Shops.get( '/shops', ( _, res ) => {
    res.render( 'Shops_Table', { 'Shops': ShopsMan.i, 'title': 'Shops' } );
} );

Route_Shops.post( '/shops/del', ( req, res ) => {
    f_tryOperation( res, ShopsMan.m_del( req.body.id ) );
} );

Route_Shops.post( '/shops/add', ( req, res ) => {
    const match = ShopsMan.m_new( req.body );
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[ v.type ]( v.outcome );
    };
    res.render( 'Shops_Table', { 'Shops': ShopsMan.i, 'title': 'Shops' } );
} );

/* * No permite actualizar el id de forma manual, de necesitarlo borrar el producto y re agregarlo, así garantiza el uso correcto de UUID */
// ! Pork no puedo poner put aquí y q el form lo indique
Route_Shops.post( '/shops/update', ( req, res ) => {
    const match = ShopsMan.m_set( req.body.id, req.body );
    if ( match instanceof Error ) {
        const v = Verdicts[match.cause];
        return res.status( v.status )[ v.type ]( v.outcome );
    };
    res.render( 'Shops_Table', { 'Shops': ShopsMan.i, 'title': 'Shops' } );
} );

Route_Shops.get( '/', ( _, res ) => {
    res.render( 'Shops_InputForm', { 'title': 'Inicio' } );
} );

// WIP Pensar q sería mejor retornar
// ! TEST f_tryOperation CUSTOM OUTPUT
Route_Shops.post( '/shops/save', ( _, res ) => {
    f_tryOperation( res, ShopsMan.m_fileSave(), ShopsMan.i );
} );

// WIP Pensar q sería mejor retornar
// ! TEST f_tryOperation CUSTOM OUTPUT
Route_Shops.post( '/shops/reset', ( _, res ) => {
    f_tryOperation( res, ShopsMan.m_fileReset(), ShopsMan.i );
} );
// ! Hacer q cada tanto se graben en un archivo, usando timer o cada vez q termina una operación -> Peligro si es ASYNC
// ! Crear JSONBoxRAMCached, q use UUID y agregar timestamp creted, timestamp mod, si se mod o crea se agrega o re agrega al final del array ( borra y agrega )
    //  q tenga una funcion save o commitToDisk para elegir cuando se guarda en disco y pedir ayuda como diceñar y o investigar (la cola de escritura, etc)
    // en vez de tener el import en la ruta de los productos se initializa la instancia de la clase con ese archivo y ahi se hace la validacion del mismo y carga a RAM
// ! revisar como esta redactada la pregunta de append a ver si es lo mismo q leer, sacar, y reescribir todo? parcial?
// To-Do Mover nanoid a lo q lo use, modificar package.json
// ! Frenar el cambio de pagina del submit




// Route_Shops.post( '/shops', ( req, res ) => {
//     const { name, race, age } = req.body;
//     Shops.push( { name, race, age } );
//     //res.status( 200 ).json( Shops );
//     res.status( 200 ).end();
// } );

export default Route_Shops;

/*
    GET '/api/productos' -> devuelve todos los productos.
    GET '/api/productos/:id' -> devuelve un producto según su id.
    POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
    PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
    DELETE '/api/productos/:id' -> elimina un producto según su id.
    - Agregar una query
*/
