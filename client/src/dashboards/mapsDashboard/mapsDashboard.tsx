import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import NahrimMap from "../../components/maps/nahrimMap";
import WindyMap from "../../components/maps/windyMap";
import MOMap from "../../components/maps/tempMap";

const MapsDashboard = () => {
  return (
    <Flex justify="center" align="center">
      <SimpleGrid columns={3} spacing={12}>
        <Box w="442px">
          <MOMap />
        </Box>
        <Box w="442px">
          <WindyMap />
        </Box>
        <Box w="442px">
          <NahrimMap />
        </Box>
      </SimpleGrid>
    </Flex>
  );
};

export default MapsDashboard;