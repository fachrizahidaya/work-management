import { Box, Flex, Icon, Pressable, Text } from "native-base";
import { Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const NewLeaveRequest = ({ onClose }) => {
  const { width, height } = Dimensions.get("window");
  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => onClose()}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Leave Request
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewLeaveRequest;
