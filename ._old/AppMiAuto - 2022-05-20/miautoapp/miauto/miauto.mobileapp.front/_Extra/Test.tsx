import { Badge, Box } from "native-base";

// ===================== OPCION 1 usando pseudo componentes

function ShadowBox ( props: any ) {
  return (<Box bg="white" py="4" px="3" borderRadius="5" rounded="md" width="96%" maxWidth="96%"  {...props} />)
};


function asd() {
  return(
  <ShadowBox
    bg="white"
    py="4"
    px="3"
    borderRadius="5"
    rounded="md"
    width="96%"
    maxWidth="96%"
    shadow="3"
  >
  </ShadowBox>
) };


// ===================== OPCION 2 Poniendo Props Extra al Final, supuesto ideal?


function qwe() {
  return(
  <Box
    bg="white" py="4" px="3" borderRadius="5" rounded="md"
    // Custom Props
    width="96%" maxWidth="96%" shadow="3"
  >
  </Box>
) };


// ===================== OPCION 3 Usando prop style


function zxc() {
  return(
    <Badge
      // Specific Props
      count={3}
      // Lib Style Props
      bg="white" py="4" px="3" borderRadius="5" rounded="md" shadow="3"
      // Custom Props
      style={ {
        width: '96%', maxWidth: '96%'
      } }
    >
    </Badge>
) };
