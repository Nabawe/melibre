import { HCard } from '../Components';
import { Box, VStack } from 'native-base';


interface Shop {
  adress: string;
  coords: string;
  cover: string;
  cover_alt: string;
  desc_short: string;
  rating: number;
  title: string;
};

interface Props {
  Data: Shop[];
};

// function Home({}: Props) {
export default function Shops( { Data }: Props ) {
  return (
    <VStack space={ 2 } alignItems="center">
      { Data.map( ( Shop, index ) => (
        <HCard
          key={ index }
          adress={ Shop.adress }
          coords={ Shop.coords }
          cover={ Shop.cover }
          cover_alt={ Shop.cover_alt }
          desc_short={ Shop.desc_short }
          rating={ Shop.rating }
          title={ Shop.title }
        />
      ) ) }
    </VStack>
  )
}
