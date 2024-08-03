import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
    badge: {
        // flex: 1
    },
    card: {
        // backgroundColor: 'white',
        flex: 0,
        // width:`${ 100 - 10 }%`,
        minWidth: '90%',
        // minHeight: 128,
        minHeight: 96,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'nowrap', // * cambiar a wrap para tests a veces
        borderColor: 'black',
        borderStyle: 'solid',
        borderRadius: 16,
        padding: '2%',
        gap: '2.5%',
        elevation: 3,
        overflow: hidden, // !!! Acomodar los otros estilos ya q no va a ser necesario el border radius en los child
    },
    cover: {
        // era 64 revisar como quedo q antes estaba muy grande
        minWidth: 32,
        minHeight: 32,
        width: 32, // ! usar tamaño variable aqui
        height: 32,
        resizeMode: 'cover',
        borderRadius: '50%',
        opacity: 0.9
    },
    content:{
        flex: 1,
        borderBottomRightRadius: 16,
        borderTopRightRadius: 16,
        // backgroundColor: 'blue'
    },
    textContent:{
        flex: 1,
        // backgroundColor: 'teal',
        borderTopRightRadius: 16,
    }
} );