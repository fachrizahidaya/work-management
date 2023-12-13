import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChecklistSection = ({ title, status, id }) => {
  return (
    <Box py={1} gap={3}>
      <Flex gap={1} flexDirection="row" alignItems="center">
        <Icon as={<MateriaCommunitylIcons name="checkbox-marked-circle-outline" />} />
        <Text strikeThrough={status === "Finish" ? true : false}>{title}</Text>
      </Flex>
    </Box>
  );
};

export default ChecklistSection;
