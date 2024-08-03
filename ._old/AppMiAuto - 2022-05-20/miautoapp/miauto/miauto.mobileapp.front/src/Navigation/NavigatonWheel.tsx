import React from 'react';
import { StackItem } from '../Components';
import { Box, Icon } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Pies from "../Data/PizzaData";


// type Props = {}

// function Home({}: Props) {
export default function NavigatonWheel() {
  return (
    <Box>
      { Pies.map( ( index ) => {
        <Icon
          color="secondary.500"
          size="5"
          as={<MaterialCommunityIcons name={Pies[index].icon} />}
        />
      } ) };
    </Box>
  )
}
