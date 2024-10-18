/* * NADA DE TEXTO ARRIBA DE LA DEF DEL SIMBOLO, escribir en el encabezado o pie del doc las cosas generales, explicativas, etc y solo poner dentro del statement lo especifico, recordatorio lo mas corto posible.
   * Lo mismo para los WIPs, y To-Dos agruparlos arriba o abajo, tal vez esto sea mejor abajo y explicaciones arriba, usar _Q template.
*/


// Maybe a factory function will be more clean
// ? As I understand I am missing the "template literal type".
type t_Key = string | number | symbol;

class Branch {
    constructor( public value: any, public index: t_Key ){
        this = [];
        [].storage = value;
        [].index = index;
        // [ "storage" ] = value;
        // ? delete index 0
        // ? ver q pasa al hacer for...of y for...in
    };
};

/** Creates a simple interface wich helps manipulate a basic array of items stored in a JSON file. A JSON file's internal items manager. This variation of JSONBox makes its instances work on a RAM cached array and they only commit it to JSON file on command.
  * @param {string} fileName
  * @param {string} fileDir The path must end with a slash /
*/
// ! una prop de TidyTree va a ser LastIndex para guardar cual fue la ultima id
class TidyTree {
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

    /** Initializes the items storage in memory.
      * @returns Returns false if it initialized without errors.
    */
    #init(): false | Error | void {
        try {
            this.i = JSON.parse( fs.readFileSync( this.filePath, 'utf-8' ) );
            return false;
        } catch( err ) {
            return console.error( new Error( `${ErrsMsgs.CLASS__INIT}:\n ${( err as Error ).message}`, { cause: 'CLASS__INIT' } ) );
        };
    };


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
};

// export type { t_Item };
export default TidyTree;
