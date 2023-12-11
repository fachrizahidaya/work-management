import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChecklistSection = ({ title, status, id }) => {
  return (
    <Pressable display="flex" bgColor="#ffffff" py={3} px={3} borderRadius={10} gap={3} flex={1}>
      <Box gap={1}>
        <Text fontSize={12} fontWeight={400}>
          Checklist (50%){" "}
        </Text>
        <Flex gap={1} flexDirection="row" alignItems="center">
          <Icon as={<MateriaCommunitylIcons name="checkbox-marked-circle-outline" />} />
          <Text strikeThrough={status === "Finish" ? true : false}>{title}</Text>
        </Flex>
      </Box>
    </Pressable>
  );
};

export default ChecklistSection;
