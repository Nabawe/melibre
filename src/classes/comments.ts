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
