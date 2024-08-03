import { HCard } from '../Components';
import { Box, VStack } from 'native-base';


// type Props = {}

// function Home({}: Props) {
export default function Home() {
  return (
    <VStack space={ 2 } alignItems="center">
        <HCard
          adress='Siemprevivo 932'
          coords="I'm Pressed 1"
          cover='https://picsum.photos/700/?324'
          cover_alt='Foto del Servicio'
          desc_short='Urgencias asd qwe zxc'
          rating={ 7 }
          title='Paparazifirulipapi'
        />
        <HCard
          adress='Rickrolling 79'
          coords="I'm Pressed 2"
          cover='https://picsum.photos/700/?374'
          cover_alt='Foto del Servicio'
          desc_short='Servicio de Entretenimiento3333333333333333333333333333333333333'
          rating={ 6 }
          title='Ratablanca'
        />
        <HCard
          adress='Cavo Cañaveral 2183'
          coords="I'm Pressed 3"
          cover='https://picsum.photos/700/?394'
          cover_alt='Foto del Servicio'
          desc_short='Siniestro asd asd asd'
          rating={ 3 }
          title='Aleluya'
        />
    </VStack>
  )
}
