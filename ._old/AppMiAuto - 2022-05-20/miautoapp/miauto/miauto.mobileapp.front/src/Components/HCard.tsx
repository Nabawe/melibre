import { Box, HStack, Icon, Image, Pressable, Text, VStack } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';


/* Iterfase's cover key should be something like ImageSource, check native-base's node_modules Image component code props OR React Native Docs */
// Improve Props Interfase redirect key
// ! Image is using 100 for width and height and that value IS NOT defined by native-base
// ! Pressable is using 96% for width and height and that value IS NOT defined by native-base
// ! Text and Cover are using fixed dimensions, either apply scaling lib or use a breakpoints array
/* ! native-base Pressable uses render prop children, it seams overkill to use here but using react-native's Pressable component COULD break NativeBaseProvider styling of the App */
interface Props {
  adress: string;
  coords: string;
  cover: string;
  cover_alt: string;
  desc_short: string;
  rating: number;
  title: string;
};

export default function HCard( { adress, coords, cover, cover_alt, desc_short, rating, title }: Props ) {
  const openMap = ( coords: string ) => { console.log( coords ) };

  return (
    <Pressable
      width='96%'
      onPress={ () => { openMap( coords ) } }
    >
      { ( { isHovered, isFocused, isPressed } ) => { return (
        <Box
          w='full' py='4' px='3' borderRadius='5' rounded='md' alignItems='center'
          shadow='3' overflow='hidden'
          bg={ isPressed ?
              'onSurface.200' : isHovered ?
                'onSurface.200' : 'primary.50'
          }
          style={ {
            transform: [ {
              scale: isPressed ? 0.96 : 1
            } ]
          } }
        >
          <HStack space='3' w='full' alignItems='center' display='flex' justifyContent='flex-start'>
            <Image
              source={ { uri: cover } }
              alt={ cover_alt } rounded='full'
              width='100' height='100'
            />
            <VStack space='1' flex='1'>
              <VStack space='1' w='full'>
                <Text fontSize='xl' color='text.900' w='full' isTruncated>
                  { title }
                </Text>
                <Text fontSize='md' color='text.900' w='full' isTruncated>
                  { adress }
                </Text>
                <Text fontSize='md' color='text.900' w='full' isTruncated>
                  { desc_short }
                </Text>
              </VStack>
              <HStack w='full' space='1' alignItems='center' justifyContent='flex-end'>
                <Icon color='tertiary.300' size='5'
                  as={ <MaterialCommunityIcons name='star' /> }
                />
                <Text fontSize='2xs' color='text.900'>
                  { rating }
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      ); } }
    </Pressable>
  );
};
