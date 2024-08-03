// import React from 'react';
import {  Box, Image, HStack, Text, VStack } from 'native-base';

// Mejorar Interface, por ejemplo cover deberia usar algo asi como ImageSource, esta en las Docs de React Native
  // * Lo de los tipos esta mas facil de ver en Native-Base, buscando el componente Image por ejemplo y viendo la lista de props
// Borrar cover alt? ya q aqui no es relevante
// Definir q areas son precionables y la accion correspondiente
interface Props {
  adress: string;
  cover: string ;
  cover_alt: string;
  desc_short: string;
  rating: number;
  title: string;
  theme: string;
};

export default function ( { adress, cover, cover_alt, desc_short, rating, title, theme }: Props ) {
  return (
    <Box bg="primary.600" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%">
      <HStack justifyContent="space-between">
        <Image
          alt={ cover_alt } height="100" rounded="full" width="100"
          source={ { uri: cover } }
        />
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text fontSize="xl" color="white">{ title }</Text>
            <Text fontSize="md" color="white">{ adress }</Text>
            <Text fontSize="md" color="white">{ desc_short }</Text>
          </VStack>
          {/* https://docs.nativebase.io/badge#page-title */}
        </Box>
      </HStack>
    </Box>
  );
};
