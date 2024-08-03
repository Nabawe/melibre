import { Home, Account, Join, OnlineHelp, UsefulPhones } from "../Screens";
import { PlaceHolder } from "../Components";


const NavigatiorConfig = [
    {
        id:         'index',
        component:  Home,
        icon:       'tire',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Inicio',
        route:      '/index'
    },
    {
        id:         'Cars',
        component:  PlaceHolder,
        icon:       'car-multiple',
        iconColor:  '',
        isEnabled:  false,
        label:      'Autos',
        route:      '/cars'
    },
    {
        id:         'Directions',
        component:  PlaceHolder,
        icon:       'book-marker',
        iconColor:  '',
        isEnabled:  false,
        label:      'Direcciones',
        route:      '/directions'
    },
    {
        id:         'Favs',
        component:  PlaceHolder,
        icon:       'heart',
        iconColor:  '',
        isEnabled:  false,
        label:      'Favoritos',
        route:      '/favs'
    },
    {
        id:         'Account',
        component:  Account,
        icon:       'account-edit',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Cuenta',
        route:      '/account'
    },
    {
        id:         'Contacts',
        component:  PlaceHolder,
        icon:       'account-multiple',
        iconColor:  '',
        isEnabled:  false,
        label:      'Contactos',
        route:      '/contacts'
    },
    {
        id:         'OnlineHelp',
        component:  OnlineHelp,
        icon:       'headset',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Ayuda en Línea',
        route:      '/onlinehelp'
    },
    {
        id:         'Join',
        component:  Join,
        icon:       'store-plus',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Registrar mi Negocio',
        route:      '/join'
    },
    {
        id:         'UsefulPhones',
        component:  UsefulPhones,
        icon:       'phone-ring',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Teléfonos Útiles',
        route:      '/usefulphones'
    },
];

export default NavigatiorConfig;

/*
    https://materialdesignicons.com
    index           - Inicio               - tire                 - Rojo
    Cars            - Autos                - car-multiple
    Directions      - Direcciones          - book-marker
    Favs            - Favoritos            - heart
    Account         - Cuenta               - account-edit         - Rojo
    Contacts        - Contactos            - account-multiple
    OnlineHelp      - Ayuda en Línea       - headset              - Rojo
    Join            - Registrar mi Negocio - store-plus           - Rojo
    UsefulPhones    - Teléfonos Útiles     - phone-ring           - Rojo
*/
