// 360x640
// @expo/webpack-config @react-native-async-storage/async-storage
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import 'react-native-gesture-handler'; /* Required by React-Navigation Drawer https://reactnavigation.org/docs/drawer-navigator#installation */
import { Home, LogIn, Shops, SingUp } from "./src/Screens";
import Navigator from "./src/Navigation/Navigator";
// import { Box } from 'native-base';
import CarWashes from "./src/Mocks/Shops/CarWashes.json"


const { colors } = extendTheme( colors );
const DefaultColors = colors;
/* Secondary Colors
  Buttons, floating action buttons, and button text
  Text fields, cursors, and text selection
  Progress bars
  Selection controls, buttons, and sliders
  Links
  Headlines
*/
/* "On Colors"
  This category of colors is called “on” colors, referring to the fact that they color elements that appear “on” top of surfaces that use the color
*/
// ? Conciderar add custom Sizes to the theme
const theme = extendTheme({
  colors: {
    primary: DefaultColors.light,
    secondary: DefaultColors.red,
    tertiary: DefaultColors.amber,
    onSurface: DefaultColors.trueGray,
    // background using primary for Bgs
    // onSurface for now is just being used as a Gray Highlighter
    // 3. Light and dark variants
    // backgrounds, surfaces, errors, typography, and iconography
    // por ahi pasar por una var isDark para q el Navigator sepa si esta en modo dark o light?
  },
  // config: {
    // useSystemColorMode: true,
    // initialColorMode: colorScheme === 'dark' ? 'dark' : 'light',
  // },
});


export default function App() {
  // const { top: SafeAreaTop } = useSafeAreaInsets();
  return (
    // <Box mt={SafeAreaTop}>
      <NativeBaseProvider theme={ theme }>
          {/* <Navigator /> */}
          <Shops Data={ CarWashes } />
          {/* <Home /> */}
      </NativeBaseProvider>
    // </Box>
  );
}



