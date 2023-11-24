import { Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const UserAction = ({
  type,
  active_member,
  toggleClearChatMessage,
  toggleDeleteModal,
  toggleExitModal,
  toggleDeleteGroupModal,
}) => {
  return (
    <Flex flex={1} px={16} py={2} gap={2} bg="#FFFFFF">
      <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Icon as={<MaterialIcons name="close" />} size={5} />
        <Text fontSize={14} fontWeight={400}>
          Clear Chat
        </Text>
      </Pressable>
      {type === "personal" && (
        <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleDeleteModal}>
          <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
          <Text fontSize={14} fontWeight={400}>
            Delete Chat
          </Text>
        </Pressable>
      )}
      {type === "group" && active_member === 1 && (
        <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleExitModal}>
          <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
          <Text fontSize={14} fontWeight={400}>
            Exit Group
          </Text>
        </Pressable>
      )}
      {type === "group" && active_member === 0 && (
        <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleDeleteGroupModal}>
          <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
          <Text fontSize={14} fontWeight={400}>
            Delete Group
          </Text>
        </Pressable>
      )}
    </Flex>
  );
};

export default UserAction;
