/*
    + Mercado Libre Category ID Dump
    https://developers.mercadolibre.com.ar/en_us/categories-and-attributes#Category-Dump

    curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' https://api.mercadolibre.com/sites/MLA/categories/all
        MLA = Mercado Libre Argentina
        Format = .gz ( JSON format within a gzip-encoded response )
    +

    + queryString

    !!! Solo parece estar tomando q y category

    available_condition: 'new' could be deprecated in a near future, if it fails change to either:
        'attributes.attribute_id': 'ITEM_CONDITION',
        'attributes.value_name': 'Nuevo'
    OR
        available_filters: 'ITEM_CONDITION:Nuevo' // Encode condition as 'attribute:value'

    The previous two alternatives were AI generated they might be wrong.

    available_filters
        Has a list of usable filters but it seams it only works with the .id values as:
        'BRAND.id': '18034'   which corresponds to AMD
        'LINE.id': '968657', // Ryzen 7'

    querying attributes didn't work
        attributes: [
            { id: 'ALPHANUMERIC_MODEL', id: '133' }
        ]
    +
*/

// Define your Search Item and Category variables
const searchItem = 'AMD Ryzen 7 7500';
const category = 'MLA1693';

// Build the query string with Search Item and Category
const queryString = new URLSearchParams( {
    q: searchItem,
    category: category,
    condition: 'new', // THIS ONE WORKS !
    // 'sort.id': 'price_asc', // Menor precio, a veces igual parece q ML le da prioridad a cosas
    // 'sort.id': 'price_desc', // Mayor precio
    'sort.id': 'relevance', // Más relevantes
    // 'LINE.id': '2244215', // Ryzen 5
    // 'LINE.id': '968657', // Ryzen 7'
} );


import express from 'express';
import handlebars from 'handlebars';
import https from 'https';

const app = express();

// Base URL for MercadoLibre API search
const baseUrl = 'https://api.mercadolibre.com/sites/MLA/search?';
const url = baseUrl + queryString.toString();

// Function to fetch and process data
async function fetchData() {
    return new Promise( ( resolve, reject ) => {
        https.get( url, ( res ) => {
            let data = '';

            res.on( 'data', ( chunk ) => {
                data += chunk;
            } );

            res.on( 'end', () => {
                const jsonData = JSON.parse( data );
                resolve( jsonData );
            } );
        } ).on( 'error', ( err ) => {
            reject( err );
        } );
    } );
}

// Define your Handlebars template
const template = handlebars.compile( `
    <body style="background-color: #212121; color: white; margin: 0;">
        <h1 style="text-align: center;"> <span style="color: #4fc3f7; text-align: center;">{{ items.length }} Results for : </span> {{ searchItem }} </h1>
        <div class="container">
            {{#each items}}
            <div class="card">
                {{#if this.thumbnail}}
                <img src="{{ this.thumbnail }}" alt="{{ this.title }}" class="card-image">
                {{/if}}
                <div class="card-content">
                <span class="card-title" style="color: #7986cb;">{{ this.title }}</span>
                <div class="card-details">
                    <span class="card-price" style="color: #fdd835;">Price: {{ this.price }} $</span>
                    <span style="margin-right: 5px;">&nbsp;</span>  <a href="{{ this.permalink }}" class="btn btn-primary" style="color: #69f0ae;">Link</a>
                </div>
                </div>
            </div>
            {{/each}}
        </div>
    </body>

    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 10px;
        }

        .card {
            width: 100%; /* Full width */
            display: flex; /* Allow inline content */
            align-items: center; /* Vertically center content */
            padding: 20px; /* Increased padding */
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1); /* Softer shadow on all edges */
            transition: 0.3s;
            background-color: #303030;
            color: white;
            margin-bottom: 15px; /* Add padding between cards */
        }

        .card:hover {
            box-shadow: 0px 4px 8px 0px rgba(255, 255, 255, 0.3); /* Slightly stronger hover effect */
        }

        .card-image {
            width: 100px; /* Adjust width as needed */
            height: auto; /* Maintain aspect ratio */
            object-fit: cover;
            margin-right: 10px;
        }

        .card-content {
        flex-grow: 1; /* Allow remaining space for title */
        }

        .card-details {
            display: flex;
            justify-content: flex-end; /* Right-align price and hyperlink */
        }

        .card-title,
        .card-price {
            font-weight: bold;
        }
    </style>
`);

// Route handler for the root path ('/')
app.get( '/', async ( req, res ) => {
    try {
        const jsonData = await fetchData();
        const context = {
            searchItem: searchItem,
            items: jsonData.results
        };

        const html = template( context );
        res.send( html );
    } catch ( error ) {
        console.error( 'Error:', error );
        res.status( 500 ).send( 'Error fetching data' );
    }
} );

app.get( '/json', async ( req, res ) => {
    try {
        const jsonData = await fetchData();
        res.json( jsonData ); // Send data as JSON with proper formatting
    } catch ( error ) {
        console.error( 'Error:', error );
        res.status( 500 ).send( 'Error fetching data' );
    }
} );

// Start the server
app.listen( 3000, () => {
    console.log( 'Server listening on port 3000' );
} );
