/* ? Needs polishing, fundaments or criteria
    + No se deberia dar acceso directo a this.i ( items ), sino q todo se haga a travez de metodos para garantizar integridad.

    + // ! RAMBox should NOT let to manually specify or MODIFY IDs, IDs MUST BE READ ONLY or only modifiable internally by the class to restructure, reindex, etc. At most what a user can do is to issue a delete and recreate the item.

    + // ! Many aspects of the class struggle to define a general form, I believe the class should manage the simplests aspects of the Item's Array. The incoming data should be checked by a specialized part of the server as soon as it is received from the front. This class instead should focus on the integrity of the data so any external customization SHOULD BE AVOIDED BY DESIGN.
    Origins of this thought came from thinking that #init, m_new, m_set would need an external specification of the Item's Extra Properties and how to handle, verify, compare them, etc.
    The other way to think about this is that the class should be re-written for each use case.
*/
/* WIP
    + Operaciones Sincronicas a Asincronicas
    + #init
    + #dataChecks


    + Operaciones Sincronicas a Asincronicas:
        // * Lo q se tiene q lograr es q haya capas de cache en RAM y tmp files para garantizar q no se pierda información y q solo se graben los datos de forma paralela cuando se pueda efectuar la totalidad de la operación.
        // * O sea definir q hace cada capa, como y cuando. ( Volatile, Small Tmp File, Big Storage ).
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
*/
/* TO-DO
    + DO A METHOD to search by any property, the way to evaluate each property might be needed or use simple comparisons, search like exact and lazy, fuzy.
*/
