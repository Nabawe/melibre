import { Map, OnlineHelp, Shops } from "../Screens";


const PizzaData = [
    {
        id:         'gasStations',
        component:  Map,
        icon:       'gas-station',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Estaciones de Servicio',
        route:      '/gasstations'
    },
    {
        id:         'lubricantShops',
        component:  Map,
        icon:       'oil',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Lubricentros',
        route:      '/lubricantshops'
    },
    {
        id:         'tireWorkshops',
        component:  Map,
        icon:       'tire',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Gomerias',
        route:      '/tireworkshops'
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
        id:         'PaintWorkshops',
        component:  Shops,
        icon:       'brush-variant',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Talleres de Chapa y Pintura ',
        route:      '/paintworkshops'
    },
    {
        id:         'Mechanics',
        component:  Shops,
        icon:       'car-wrench',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Talleres Mecánicos',
        route:      '/mechanics'
    },
    {
        id:         'carWashes',
        component:  Shops,
        icon:       'car-wash',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Lavaderos',
        route:      '/carwashes'
    },
    {
        id:         'Batteries',
        component:  Shops,
        icon:       'car-battery',
        iconColor:  'red',
        isEnabled:  true,
        label:      'Baterías',
        route:      '/Batteries'
    },
];

export default PizzaData;

/*
    https://materialdesignicons.com
    Map             gasStations         Estaciones de Servicio          gas-station
    Map             lubricantShops      Lubricentros                    oil
    Map             tireWorkshops       Gomerias                        tire
    OnlineHelp      OnlineHelp          Ayuda en Línea                  headset
    Shops           PaintWorkshops      Talleres de Chapa y Pintura     brush-variant
    Shops           Mechanics           Talleres Mecánicos              car-wrench
    Shops           carWashes           Lavaderos                       car-wash
    Shops           Batteries           Baterías                        car-battery
*/
