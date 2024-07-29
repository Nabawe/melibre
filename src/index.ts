import 'dotenv/config';
import Express from "express";
import { fileURLToPath } from 'node:url';
import { engine as HbsEngine } from 'express-handlebars';

import type { Application as ExpressApp, Response } from "express";

import Route_Products from './routes/products.route.js';

// const Server: ExpressApp = Express();
interface ExpressAppMod extends ExpressApp {
    activeListeners?: any[];
};
const Server: ExpressAppMod = Express();
const PORT = process.env.PORT || 8080;

// JSON output
Server.use( Express.json() );
Server.use( Express.urlencoded( { extended: true } ) );
// Static Files
Server.use( Express.static( fileURLToPath( new URL( './public', import.meta.url ) ) ) );
// express-handlebars
Server.engine( 'handlebars', HbsEngine() );
Server.set( 'view engine', 'handlebars' );
Server.set( 'views', fileURLToPath( new URL( './views', import.meta.url ) ) );


console.log( `##################################### ${ new Date }` );


// Routes
Server.use( '/', Route_Products );

Server.get( '*', ( _, res: Response ) => {
    res.status( 404 ).sendFile( fileURLToPath( new URL( './public/404.html', import.meta.url ) ) );
} );

// Last Touches and Opening the Server's Port
const currentListener = Server.listen( PORT, () => {
    console.log( `Server Up and Listening, Info: ${ JSON.stringify( currentListener.address(), null, 4 ) }` );
} );

Server.activeListeners ?
    Server.activeListeners.push( currentListener )
    : Server.activeListeners = [ currentListener ];

currentListener.on( 'error', error => { console.log( `Server Error: ${error}` ); } );

