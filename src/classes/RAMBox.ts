/* ? Needs polishing, fundaments or criteria
    + No se deberia dar acceso directo a this.i ( items ), sino q todo se haga a travez de metodos para garantizar integridad.

    + // ! RAMBox should NOT let to manually specify or MODIFY IDs, IDs MUST BE READ ONLY or only modifiable internally by the class to restructure, reindex, etc. At most what a user can do is to issue a delete and recreate the item.

    + // ! Many aspects of the class struggle to define a general form, I believe the class should manage the simplests aspects of the Item's Array. The incoming data should be checked by a specialized part of the server as soon as it is received from the front. This class instead should focus on the integrity of the data so any external customization SHOULD BE AVOIDED BY DESIGN.
    Origins of this thought came from thinking that #init, m_new, m_set would need an external specification of the Item's Extra Properties and how to handle, verify, compare them, etc.
    The other way to think about this is that the class should be re-written for each use case.

    + ? UUIDs are not concidered good indexes for databases, neither linear sequenses for security reasons.
*/
/* WIP
    + Operaciones Sincronicas a Asincronicas
    + #init
    + #dataChecks
    +   catch( err: any )


    + Operaciones Sincronicas a Asincronicas:
        // * Lo q se tiene q lograr es q haya capas de cache en RAM y tmp files para garantizar q no se pierda información y q solo se graben los datos de forma paralela cuando se pueda efectuar la totalidad de la operación.
        // * O sea definir q hace cada capa, como y cuando. ( Volatile, Small Tmp File, Big Storage ) ( Timed Saves? ).
        // * Prestar mucha atención q es resuelto automaticamente por las herramientas q ya existen, ej: por ahi alguna base de datos ya tiene algun tipo de cache.

        Quiero q m_fileSave, m_fileReset y #init sean async:
            - #init:
                · Posiblemente tenga q comunicar q se están cargando los datos. Pero la initialización del servidor no debería ser async.

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
    +

    + #init
        - Hacer q cree el archivo si no existe o q eso pase al apretar save (commit to file)? (Por ahora si pasara eso habria un error al pasar el arg o se dispararia el catch); también tendría q crear los directorios.
        - // ! Esto puede tambien fallar si la totalidad del archivo es uno de los tipos minimos de JSON ejemplo si solo tuviera null dentro. No se si es suficiente el checkear el lenght.
        - // ! Aqui return new Error no tiene sentido ya q no hay nadie q lo capture al error y lo muestre.
        - // ! No tiene sentido q sea un JSON, agrega un parse q no existiria si fuera directamente un objeto exportado de un file.ts .
    +

    + #dataChecks
        - Cuanto sentido tiene tener la posibilidad de agregar flags, no esta hecho a la medida? Y sino no tendria q ser uno de los parametros q initializa la clase?
            // * O sea lo de agregar nuevas flags tendria q pasar a nivel development y no runtime por ende no tiene sentido complicarlo. Y pensar q los checkeos tienen q ser algo fundamental q se aplique a situaciones generales y no a un tipo especifico de Items.
    +

    +   catch( err: any )
        Many methods have the following code :
            "
                } catch( err: any ) {
                return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${err.message}`, { cause: 'CAN_T_READ' } );
                };
            "
        That could be type fixed by :
            "
                } catch( err ) {
                    if ( err instanceof Error ) {
                        return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${err.message}`, { cause: 'CAN_T_READ' } );
                    };
                };
            "

        But the "type fixed" way just puts layers on a return that must happen if it enters into the catch.
    +
*/
/* To-Do
    + DO A METHOD to search by any property, the way to evaluate each property might be needed or use simple comparisons, search like exact and lazy, fuzy.
*/
import ErrsMsgs from '../data/messages/errors.msg.json' assert { type: "json" };
import fs from 'node:fs';
import { nanoid as f_makeUUID } from 'nanoid';

// import type { URL } from 'node:url';
/*
    + Removed products_types.ts and related expressions;
    Commits :
        9a3036e06f21ff9982bb6ea952aa79976149f341
        87b282b5950a6789b7574d7fddb7f4ed4b9e9ed4
        ba269c83597207a2fc71e29ab4f5cc8b494d8fa1

    + Commit before restructuring commets: d4752d48a62a5281cad85baab7e8ab46b90abe13
*/


type t_Comparison = '===' | '!==' | '==' | '!=' | '>' | '<' | '>=' | '<=';
// make a better t_Id
type t_Id = string | number | symbol;
// ? As I understand I am missing the "template literal type".
type t_IndexKey = string | number | symbol;
// type t_Index = { [ key: t_IndexKey ]: any }; // Commented out since it was unused
interface t_Item {
    id: t_Id;
    dateCreated: number;
    dateMod?: number;
    [ key: t_IndexKey ]: any;
};
interface t_DataChecksFlags {
    [ key: Uppercase<string> ]: boolean;
};

const fsP = fs.promises;


/** Creates a simple interface wich helps manipulate a basic array of items stored in a JSON file. A JSON file's internal items manager. This variation of JSONBox makes its instances work on a RAM cached array and they only commit it to JSON file on command. */
class RAMBox {
    /**
     * @param {string} fileName
     * @param {string} fileDir The path must end with a slash /
     * WIP Hacer q lo reciva usando la expresion URLToPath new URL
     */
    public filePath: string;
    // "!" as TS "non-null assertion operator" not sure if it is the correct usage.
    public i!: t_Item[];
    constructor(
        public fileName: string,
        public fileDir: string
    ) {
        // this.fileName = fileName;
        // this.fileDir = fileDir;
        this.filePath = `${fileDir}${fileName}`;
        this.#init();
    };


    /**
     * Initializes the items storage in memory.
     * @returns Returns false if it initialized without errors.
     */
    // ! this function will NEVER return void, always false or a specific Error w a cause
    #init(): false | Error | void {
        try {
            this.i = JSON.parse( fs.readFileSync( this.filePath, 'utf-8' ) );
            return false;
        } catch( err ) {
            return console.error( new Error( `${ErrsMsgs.CLASS__INIT}:\n ${( err as Error ).message}`, { cause: 'CLASS__INIT' } ) );
        };
    };

    // WIP Add Other Checks
    /* WIP Add ways to specify the checks like with a hash 3b40v69 or binary string 010110 or flags object, so it can skip unnecesary checks for a given scenario */
    // ? Should both Parameters be optional
    // ! this function will NEVER return void, always false or a specific Error w a cause
    #dataChecks( flags?: t_DataChecksFlags | undefined, data = this.i ): false | Error | void {
        // Add new default values to flags in F.
        /*
            let F: t_DataChecksFlags = { NO_DATA: true, ...flags };
            This line should fail when flags is undefined or an empty object since both are not iterables.
                Thats what the docs say but it practice I never saw it fail.
        */
        let F: t_DataChecksFlags = { NO_DATA: true };
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
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${( err as Error ).message}`, { cause: 'CAN_T_READ' } );
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
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_READ}:\n ${( err as Error ).message}`, { cause: 'CAN_T_READ' } );
        };
    };

    // <3
    m_getById( _id: t_Item["id"] ): t_Item | Error {
        return (
            this.#dataChecks()
            || ( this.i.find( obj => _id === obj.id )
            || new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } ) )
        );
    };

    /*
        field: keyof t_Item causes :
            " Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.ts(2731) "
        Furthermore RAMBox is not aware of new custom fields and the way t_Item is defined is quite flexible so this should be redundant.
    */
    m_filter( field: string, operator: t_Comparison, value: any ): t_Item[] | Error {
        const verdict = this.#dataChecks();
        if ( verdict )
            return verdict;

        console.log( "argTypes : ", typeof field, " ", typeof operator, " ", typeof value, " " );

        // Validate field
            /* ! Bring back ExtraProps, change its name to reflect that they are only to be specified when an external file brings new props */
            // m_isValidField don't make it private since it could be useful

        // Validate value
            // ? Can value be undefined? if so set it as an optinal arg or at least assing empty string or something that coarses to 0
            // En el ejemplo "Improved Filter Method with Type Handling" Claude usa el type del Field para convertir el type del valor, de hacerlo aclararlo en una Doc String
                // ! IMPLEMENTARLO DE ESA FORMA
            // recordar sobre coersion de Booleans, Null, Dates, y Float

        // ! Changes operators to EQ, M, etc so that it is easier to write or some other way to take the symbols =, >, etc string directly, check how scryfall does
        // ! Double quotes or single quotes on scryfall to allow for spaces
        const ValidOperators = [ '===' , '!==' , '==' , '!=' , '>' , '<' , '>=' , '<=' ];
        if ( !( ValidOperators.includes( operator ) ) ) {
            return new Error(
                ErrsMsgs['FILTER__INVALID_OPERATOR'],
                { cause: 'FILTER__INVALID_OPERATOR' }
            );
        };


        /*
            ! Check the query is not empty xD
                ? Only specifing the FIELD means that the query will seek a result that has that FIELD but what should be the interpretation of the following cases :
                    "field7:=:",
                    "field7:>:",
                    "field8:=::",
                    "field8:<::",
                        ? Do they change the nature of "FIELD exists"

            ! trim values, fields, operators

            * Check the built in encode and decode URL from JS.

            + Por todo lo siguente usar entonces query
                - Separation of concerns: It clearly separates the resource identifier (path) from the query criteria.
                - RESTful design: In RESTful APIs, the path typically identifies a resource, while query parameters modify how that resource is retrieved or filtered.
                - Flexibility: It's easier to add or remove query parameters without changing the route structure.

            Percent-Encoded
                : / ? # [ ] @ ! $ & ' ( ) * + , ; = % SPACE
                So double quotes might be better than single? Test

            * creo q solo debería permitir los q no hacen type coercion
            * ~ not equal, no se si todos los teclados lo tienen comodo, pensar en alts como :
                * el alt correcto creo termina siendo ! ya q deberia estar en todos los teclados
            * ! invert or not
                * creo q termina siendo mejor usar el - ya q no necesita escape
            * el uso de : en vez de = por ahi simplifica para teclados
            * Por ahi se podrian usar {} para reemplazar a las quotes o `
            * Space o | como separador casi seguro q | esta en todos pero mejor guardarlo para OR
                * el AND esta representado por ESPACIOS
            ? XOR

            ':': '===',
            '!': '!==',
            '=': '==',
            '~': '!=',
            '>': '>',
            '<': '<',
            '>=': '>=',
            '<=': '<='

            'g': '>=',  // 'g' for 'greater than or equal'
            'l': '<='   // 'l' for 'less than or equal'

            '≠': '!==',

            Allowed Characters (can be used without encoding):
                · Truly "Safe" characters: Alphanumeric characters and -, ., _, ~ are safe to use anywhere in a URL without encoding.
                · Alphanumeric characters: A-Z, a-z, 0-9
                · Unreserved characters: - . _ ~ (hyphen, period, underscore, tilde)
                · Reserved characters (when used for their reserved purposes): ! $ & ' ( ) * + , ; = : @ / ?

            const mappedOperator = OperatorMap[operator as string] || operator;
                De esta manera si la comparacion a usar no esta en la array de comparaciones se puede mandar una custom, pensar si eso no seria un error.

            * Scryfall parece q usa una sola string , eso permite escribir cualquier caracter en la URL y se transforma automaticamente, habria q ver como lo recibe el server.
                ! es muy importante ya q aparentemente esos caracteres especiales por ejemplo se usan para determinar cuando empiesa o termina algo al estilo del & para mas variables, ver para q se usa el ! y :
                - Use a custom query string format:
                    http://localhost:8080/products/f?query=dateCreated:1655604430649
                    Here, you define your own syntax (e.g., : for equality, > for greater than, etc.)
                - Esto tal vez haga q se tenga q renombrar el metodo o crear otro

            + El artifact Mathematical Symbol Operator Parsing usa
                const match = queryString.match(/^(\w+)(=|≠|>|<|g|l)(.+)$/);

            + Artifact : "Custom URL Parsing with Special Characters" y "Mathematical Symbol Operator Parsing"
                tienen mecanismos con regex para match y split
                    en mi caso usaria 2 tipos de split:
                        SPACE   = AND
                        |       = OR

            + Luego de definir si usar query o params tambien crear algo q use req.body q permita recivirlo por POST para queries aun mas complejas

            + No olvidarse de analizar el caso de las dates y las Claude Conversations q ya tuve sobre el tema.
        */

        /*
            If this was used instead :
                ${value} ${operator} obj.${field}

            Some comparisons would be inverted, since in the URL one specifies the operator first.
            Think of the > < cases.

            ? Are there any special considerations to be made for the lose operators ? (==, >=, ...)
                coercion
            ? All arguments are strings since they come from HTTP URLs do I need a special concideration when for example comparing numbers or other special more complex values?
        */
        const f = new Function( "obj", `return ( obj => obj.${field} ${operator} ${value} )` );
        const result = this.i.filter( f() );
        if ( result.length > 0 )
            return result;

        return new Error( ErrsMsgs['FILTER__NO_MATCH'], { cause: 'FILTER__NO_MATCH' } );
    };

    m_new( newItem: t_Item ) {
        // ! HERE BEFORE RECEIVING req.body there should be somekind of check that confirms the integrity of the data from the front-end
            // * dataChecks seria solo para cosas como existencia de datos, verificar q haya donde guardarlos y otras generales pero en routes iria el revisar la integridad q el front le paso
        const verdict = this.#dataChecks( { NO_DATA: false } );
        if ( verdict )
            return verdict;

        return this.i.push( {
            ...newItem,
            id: f_makeUUID(),
            dateCreated: Date.now(),
        } );
    };

    // Se podria usar delete[index] y luego al grabar o reindexar remover los undefined
    m_del( id: t_Id ) {
        const verdict = this.#dataChecks();
        if ( verdict )
            return verdict;

        const index = this.i.findIndex( obj => id === obj.id );
        if ( index !== -1 )
            return this.i.splice( index, 1 );

        return new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } );
    };

    // ! m_set is subject to the same checking problems as m_new
    m_set( id: t_Id, data: t_Item ){
        const verdict = this.#dataChecks();
        if ( verdict )
            return verdict;

        const index = this.i.findIndex( obj => id === obj.id );
        if ( index === -1 )
            return new Error( ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' } );
            /* The idea was if the ID did not exist it would create a new item, but that kind of behaviour may lead to create entries by mistake when mistyping an Id. */
            // return this.m_new( data ); // ! Se corre dataChecks 2 veces así

        /* Previously done with assignement destructuring commit : c9f6562307abd0252ef0ef953cb609250d833b4b */
        this.i[index] = { ...data };
        /* this.i[index] = data; This should also work but the chosen method was to make a real copy ( deep vs shallow copies ) */

        const Target = this.i[index];
        Target.dateMod = Date.now();

        return Target;
    };

    /*
        ! No crea un archivo nuevo si no existe, de tener q crearlo tambien tendria q poder crear toda la ruta, o sea los dirs

        ! Tendria q usar append y es una animalada hacerlo de esa forma, esta en las preguntas Questons-02.txt.

        ? confirmar q el metodo append de FS no cargue todo el archivo para modificarlo
    */
    m_fileSave() {
        try {
            fs.writeFileSync( this.filePath, JSON.stringify( this.i, null, 4 ), 'utf-8' );
            return false;
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_SAVE}:\n ${( err as Error ).message}`, { cause: 'CAN_T_SAVE' } );
        };
    };

    // Pensar ¿Tendria algun sentido q solo borre el archivo del disco pero deje sin tocar la RAM?
    m_fileReset() {
        try {
            fs.writeFileSync( this.filePath, '[]', 'utf-8' );
            this.i = [];
            return false;
        } catch( err ) {
            return new Error( `${ErrsMsgs.CAN_T_RESET}:\n ${( err as Error ).message}`, { cause: 'CAN_T_RESET' } );
        };
    };
};

export type { t_Item };
export default RAMBox;
