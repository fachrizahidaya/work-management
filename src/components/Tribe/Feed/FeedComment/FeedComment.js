import { Flex, Icon, Pressable, Slide, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const FeedComment = ({
  handleOpen,
  handleClose,
  loggedEmployeeId,
  loggedEmployeeImage,
  postId,
  total_comment,
  onSubmit,
}) => {
  return (
    <>
      <Slide in={handleOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Pressable onPress={() => setIsOpen(!isOpen)}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
            </Pressable>
            <Text fontSize={16} fontWeight={500}>
              Comment
            </Text>
          </Flex>
        </Flex>
      </Slide>
    </>
  );
};

export default FeedComment;
