import * as React from "react";
import { Box, Heading, VStack, FormControl, Icon, Input, Button, Center } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const Example = () => {
  return <Center w="100%">
    <Box safeArea p="2" w="90%" maxW="290" py="8">
      <Center>
        <Icon as={MaterialCommunityIcons} name="web" color="secondary.400" size={32} _dark={{
          color: "secondary.900"
        }} />
      </Center>
      <VStack space={3} mt="2">
        <FormControl>
          <FormControl.Label>Nombre de Usuario</FormControl.Label>
          <Input />
        </FormControl>
        <FormControl>
          <FormControl.Label>Mail</FormControl.Label>
          <Input />
        </FormControl>
        <FormControl>
          <FormControl.Label>Contraseña</FormControl.Label>
          <Input type="password" />
        </FormControl>
        <FormControl>
          <FormControl.Label>Confirmar Contraseña</FormControl.Label>
          <Input type="password" />
        </FormControl>
        <Button mt="2" colorScheme="secondary">
          Registrarme
        </Button>
      </VStack>
    </Box>
  </Center>;
};

export default function SingUp() {
  return (
    <Center flex={1} px="3">
      <Example />
    </Center>
  );
};
