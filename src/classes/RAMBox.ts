/* WIP
    Error de diceño fundamental, no se deberia dar acceso directo a this.i ( items ), sino q todo se haga a travez de metodos para garantizar integridad.

    Operaciones Sincronicas a Asincronicas:
        Quiero q m_fileSave, m_fileReset y #init sean async:
            - #init:
                · Posiblemente tenga q comunicar q se están cargando los datos.

            - m_fileSave:
                1 - Retorna aviso de q esta por comensar para q tanto el Backend como el Frontend bloqueen todas las operaciones q usen el modulo fs ( los metodos q comienzan con m_file ) pero NO las que se realizen solo en RAM ( las q manipulan this.i ), colocar los botones en estado disabled, etc.
                2 - Dispara la operación asincronica SIN AWAIT y retorna la ejecución al server.
                Aqui no se si es q tendria q colocar en forma de promesa a todo, el grabar y lo q tenga q correrse luego de terminarse de grabar.
                3 - Q se ejecuten los pasos faltantes de la funcion grabar q no tengan q ver con la escritura en disco.
                4 - Desbloquea lo bloqueado en 1.
                5 - Para luego evolucionar a q el save se dispare acordé a criterios, cierta cantidad de info nueva o cada x segs, etc.

            - m_fileReset:
                1 - Corre m_reset.
                Idem del punto 1 a 4 de m_fileSave

*/
import ErrsMsgs from '../data/messages/errors.msg.json' assert { type: "json" };
import fs from 'node:fs';
import { nanoid as f_makeUUID } from 'nanoid';

import type { URL } from 'node:url';
import type { t_ExtraProperties } from "../data/products_types.js";

const fsP = fs.promises;

/* Claude.ai Suggested
    interface BaseItem {
    id: string;
    dateCreated: number;
    dateMod?: number;
    }

    interface t_Item<T extends Record<string, any> = {}> extends BaseItem {
        [K in keyof T]: T[K];
    }
*/

// ? As I understand I am missing the "template literal type".
type t_IndexKeySignature = string | number | symbol;

type t_Index = { [ key: t_IndexKeySignature ]: any };

interface t_Item extends t_ExtraProperties {
    id: string;
    dateCreated: number;
    dateMod?: number;
    // [ key: t_IndexKeySignature ]: any;
};
interface DataChecksFlags {
    [key: Uppercase<string>]: boolean;
};

/* TO-DO Add this quirk to DocString No permite actualizar el id de forma manual, de necesitarlo borrar el producto y re agregarlo, así garantiza el uso correcto de UUID */
/** Creates a simple interface wich helps manipulate a basic array of items stored in a JSON file. A JSON file's internal items manager. This variation of JSONBox makes its instances work on a RAM cached array and they only commit it to JSON file on command. */
class RAMBox {
    /**
     * @param {string} fileName
     * @param {object} ExtraProperties
     * @param {string} fileDir The path must end with a slash /
     * WIP Hacer q lo reciva usando la expresion URLToPath new URL
     */
    public filePath: string;
    #props: string[];
    // "!" as TS "non-null assertion operator" not sure if it is the correct usage.
    public i!: t_Item[];
    constructor( public fileName: string, public ExtraProperties: string[], public fileDir: string ) {
        // this.fileName = fileName;
        // this.fileDir = fileDir;
        this.filePath = `${fileDir}${fileName}`;
        this.#props = [ "id", "dateCreated", ...ExtraProperties ];
        this.#init();
    };

    // WIP Hacer q esto tambien sea ASYNC
    /* WIP hacer q cree el archivo si no existe o q eso pase al apretar save (commit to file)? (Por ahora si pasara eso habria un error al pasar el arg o se dispararia el catch); también tendría q crear los directorios */
        /* * Ver cual es el resutlado del error para q el catch lo haga, o sea si JSON.parse o readFile dan error ver q se le pasa al catch por err y ejecutar solución */
    /* WIP MISSING PARAMETHERS
        as Objects
            - Items Extra Properties might need an object carrying functions that set how to compare and operate those new properties, for now it will use simple comparison.
            - #dataChecks, DataChecksFlags
            ! Complete the ErrsMsgs errors to adapt to new values given to dataChecks.
            - The Init method might probably need the form of the base item.

        ! All this remarks make one think that the Class Should be re-written for each use case.
    */
    /* ! Esto puede tambien fallar si la totalidad del archivo es uno de los tipos minimos de JSON ejemplo si solo tuviera null dentro. No se si es suficiente el checkear el lenght */
    /* ! Aqui return new Error no tiene sentido ya q no hay nadie q lo capture al error y lo muestre */
    /* ! No tiene sentido q sea un JSON, agrega un parse q no existiria si fuera directamente un objeto exportado de un file.ts . */
    /**
     * Initializes the items storage in memory.
     * @returns Returns false if it initialized without errors.
     */
    // ! this function will NEVER return void, always false or a specific Error w a cause
    #init(): false | Error | void {
        try {
            this.i = JSON.parse( fs.readFileSync( this.filePath, 'utf-8' ) );
            return false;
        } catch( err: any ) {
            return console.error( new Error( `${ErrsMsgs.CLASS__INIT}:\n ${err.message}`, { cause: 'CLASS__INIT' } ) );
        };
    };

    // WIP Add Other Checks
    /* WIP Add ways to specify the checks like with a hash 3b40v69 or binary string 010110 or flags object, so it can skip unnecesary checks for a given scenario */
    // * Both Parameters are optional
    // ! this function will NEVER return void, always false or a specific Error w a cause
    #dataChecks( flags?: DataChecksFlags | undefined, data = this.i ): false | Error | void {
        // Add new default values to flags in F.
        /*
            let F: DataChecksFlags = { NO_DATA: true, ...flags };
            This line should fail when flags is undefined or an empty object since both are not iterables
        */
        let F: DataChecksFlags = { NO_DATA: true };
        if ( flags )
            F = { ...F,  ...flags };
        if ( F.NO_DATA && !data.length )
            return console.error( new Error( `${ErrsMsgs.NO_DATA}`, { cause: 'NO_DATA' } ) );
        return false;
    };

    /**
     * Retrieves all the items from the file asynchronously.
     * @returns {Object}JSON formmated JavaScript object.
     */
    async m_fileGetAll(): Promise<t_Item[] | Error> {
        try {
            const data = JSON.parse( await fsP.readFile( this.filePath, 'utf-8' ) );
            return data;
        } catch( err: any ) {
            return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${err.message}`, { cause: 'CAN_T_READ' } );
        };
    };

    /**
     * Retrieves all the items from the file synchronously.
     * @returns {Object}JSON formmated JavaScript object.
     */
    m_fileGetAllSync(): t_Item[] | Error {
        try {
            const data = JSON.parse( fs.readFileSync( this.filePath, 'utf-8' ) );
            return data;
        } catch( err: any ) {
            return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${err.message}`, { cause: 'CAN_T_READ' } );
        };
    };

    // <3
    m_getById( id: t_Item["id"] ): t_Item | Error {
        return (
            this.#dataChecks()
            || ( this.i.find( obj => id === obj.id )
            || new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } ) )
        );
    };

    // TO-DO DO A METHOD to search by any property, the way to evaluate each property might be needed

    /* ! If this class was supposed to manage any kind of Items then this function should be fed the extra properties of the items when spawning the class. As well as the type of its arguments, posibly extending t_Item */
    m_new( [ ...this.#props ] ) {
        // ! no es de type t_Item ya q aqui no es un objeto sino cada prop destructurada
        // for ( const prop of item ) {

        // };

        // ? Como hacer un destructuring en los parametros usando la array this.#props
            // ? Funcionara initializando las vars antes? pero no seria destructuring
            // Seria algo de la forma de [ ...this.#props ] o { ...this.#props }
        // ! No olvidarse de revisar #props en el contructor

        const verdict = this.#dataChecks( { NO_DATA: false } );
        if ( verdict )
            return verdict;

        this.i.push( {
            id: f_makeUUID(),
            dateCreated: Date.now(),
            title, price, thumbnail
        } );
        return this.i;
    };

    // Se podria usar delete[index] y luego al grabar o reindexar remover los undefined
    m_del( id ) {
        const verdict = this.#dataChecks();
        if ( verdict )
            return verdict;

        const index = this.i.findIndex( obj => id === obj.id );
        if ( index === -1 )
            return new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } );

        return this.i.splice( index, 1 );
    };

    m_set( id, data ){
        const verdict = this.#dataChecks();
        if ( verdict )
            return verdict;

        const index = this.i.findIndex( obj => id === obj.id );
        if ( index === -1 )
            return new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } );
            /* The idea was if the ID didn't not exist it would creates a new item, but that kind of behaviour may lead to create entries by mistake when mistyping an Id. */
            // return this.m_new( data ); // ! Se corre dataChecks 2 veces así

        const Target = this.i[index];
        /* Como this.i[index] ya esta declarado tengo q colocar el destructuring entre (), ya q al no usar const o let {} se tomaría como un bloque de codigo, por eso los parentesis */
        ( {
            title: Target.title,
            price: Target.price,
            thumbnail: Target.thumbnail
        } = data );
        // const { title, price, thumbnail } = data;
        // Target.title = title;
        // Target.price  = price;
        // Target.thumbnail = thumbnail;
        Target.dateMod = Date.now();

        return Target;
    };

    /*
        ! No crea un archivo nuevo si no existe, de tener q crearlo tambien tendria q poder crear toda la ruta, o sea los dirs

        ! Tendria q usar append es una animalada hacerlo de esta forma, esta en las preguntas Questons-02.txt.

        ? confirmar q el metodo append de FS no cargue todo el archivo para modificarlo
    */
    m_fileSave() {
        try {
            fs.writeFileSync( this.filePath, JSON.stringify( this.i, null, 4 ), 'utf-8' );
            return false;
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_SAVE}:\n ${err.message}`, { cause: 'CAN_T_SAVE' } );
        };
    };

    // Pensar ¿Tiene algun sentido q solo borre el archivo del disco pero deje sin tocar la RAM?
    m_fileReset() {
        try {
            fs.writeFileSync( this.filePath, '[]', 'utf-8' );
            this.i = [];
            return false;
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_RESET}:\n ${err.message}`, { cause: 'CAN_T_RESET' } );
        };
    };
};

export type { t_Item };
export default RAMBox;
