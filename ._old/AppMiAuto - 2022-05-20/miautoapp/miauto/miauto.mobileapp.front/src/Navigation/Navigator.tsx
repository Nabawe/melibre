import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    NativeBaseProvider,
    Button,
    Box,
    HamburgerIcon,
    Pressable,
    Heading,
    VStack,
    Text,
    Center,
    HStack,
    Divider,
    Icon,
    theme,
} from "native-base";
import Pages from "../Data/NavigatorConfig";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


/*
  ? For some reason theme.colors takes the native-base defined values instead of the ones defined in App.tsx
  * Maybe Contexts are only visible INSIDE components and not their outside definitions?.
*/
// WIP Complete ThemeTranslator missing keys
const ThemeTranslator = {
  dark: false,
  colors: {
    // primary: theme.colors.green[400],
    background: theme.colors.light[50],
    card: theme.colors.light[50],
    // text: theme.colors.blue[500],
    // border: theme.colors.red[500],
    // notification: theme.colors.indigo[500],
  },
};

global.__reanimatedWorkletInit = () => { };

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} safeArea>
            <VStack divider={<Divider />} space="6" my="2" mx="1">
                <Box px="4">
                    <Text bold color="text.700">
                        Mail
                    </Text>
                    <Text fontSize="14" mt="1" color="text.500" fontWeight="500">
                        john_doe@gmail.com
                    </Text>
                </Box>
                <VStack space="3">
                    {props.state.routeNames.map((name, index) => (
                        <Pressable
                            key={ index }
                            px="5"
                            py="3"
                            rounded="md"
                            bg={
                                index === props.state.index
                                    // trueGray.500 + Alpha
                                    ? "rgba(115, 115, 115, 0.1)"
                                    : "transparent"
                            }
                            onPress={(event) => {
                                props.navigation.navigate(name);
                            }}
                        >
                            <HStack space="7" alignItems="center">
                                <Icon
                                    color={
                                        index === props.state.index ? "secondary.500" : "text.500"
                                    }
                                    size="5"
                                    as={<MaterialCommunityIcons name={Pages[index].icon} />}
                                />
                                <Text
                                    fontWeight="500"
                                    color={
                                        index === props.state.index ? "secondary.500" : "text.700"
                                    }
                                >
                                    {name}
                                </Text>
                            </HStack>
                        </Pressable>
                    ))}
                </VStack>
            </VStack>
        </DrawerContentScrollView>
    );
}

function MyDrawer() {
    return (
        <Box safeArea flex={1}>
            <Drawer.Navigator
              drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
              { Pages.map( ( page, index ) => (
                <Drawer.Screen key={ index } name={ page.label } component={ page.component } />
              ) ) }
            </Drawer.Navigator>
        </Box>
    );
}

export default function Navigator() {
    return (
      <NavigationContainer theme={ ThemeTranslator }>
          {/* <NativeBaseProvider theme={theme}> */}
              <MyDrawer />
          {/* </NativeBaseProvider> */}
      </NavigationContainer>
    );
}
