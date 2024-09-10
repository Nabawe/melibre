import 'dotenv/config';
import Express from "express";
import type { Application as ExpressApp, Response } from "express";
import { fileURLToPath } from 'node:url';
import { engine as HbsEngine } from 'express-handlebars';

import Route_Products from './routes/products.route.js';


interface ExpressAppMod extends ExpressApp {
    activeListeners?: any[];
    // type t_Listener = ExpressApp["listen"];
    // activeListeners?: t_Listener[];
    // then below when opening the port currentListener: t_listener
};


const Server: ExpressAppMod = Express();
const PORT = process.env.PORT || 8080;


// JSON output
Server.use( Express.json() );
// Forms output into req.body JSON
Server.use( Express.urlencoded( { extended: true } ) );
// Static Website Files
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
// ? No adress is being shown, is it a Unix thing?
const currentListener = Server.listen( PORT, () => {
    console.log( `Server Up and Listening, Info: ${ JSON.stringify( currentListener.address(), null, 4 ) }` );
} );

Server.activeListeners ?
    Server.activeListeners.push( currentListener )
    : Server.activeListeners = [ currentListener ];

currentListener.on( 'error', error => { console.log( `Server Error: ${error}` ); } );

