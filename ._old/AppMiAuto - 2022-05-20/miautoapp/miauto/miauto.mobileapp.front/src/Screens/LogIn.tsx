import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Icon, Input, Link, Button, HStack, Center } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const Example = () => {
  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Center>
          <Icon as={MaterialCommunityIcons} name="web" color="secondary.400" size={ 32 } _dark={{
            color: "secondary.900"
          }} />
          <Heading size="lg" fontWeight="600" color="text.800" _dark={{
            color: "text.50"
          }}>
            Bienvenido
          </Heading>
          <Heading mt="1" _dark={{
            color: "text.200"
          }} color="text.600" fontWeight="medium" size="xs">
            Iniciar sesión para continuar.
          </Heading>
        </Center>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Mail</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl>
            <FormControl.Label>Contraseña</FormControl.Label>
            <Input type="password" />
            <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "secondary.500"
            }} alignSelf="flex-end" mt="1">
              ¿Olvidaste tus datos?
            </Link>
          </FormControl>
          <Button mt="3" colorScheme="secondary">
            Iniciar Sesión
          </Button>
          <HStack mt="6" justifyContent="center">
            <Link _text={{
              color: "secondary.500",
              fontWeight: "medium",
              fontSize: "sm"
            }} href="#">
              Crear Cuenta
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};

export default function LogIn() {
  return (
    <Center flex={1} px="3">
      <Example />
    </Center>
  );
};
