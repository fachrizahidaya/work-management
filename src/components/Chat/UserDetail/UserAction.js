import { Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const UserAction = ({
  type,
  active_member,
  toggleClearChatMessage,
  toggleDeleteModal,
  toggleExitModal,
  toggleDeleteGroupModal,
  name,
}) => {
  return (
    <Flex borderRadius={10} mx={3} px={2} py={2} gap={3} bg="#FFFFFF">
      <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Clear Messages
        </Text>
      </Pressable>

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
      <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Block {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable>
      <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Report {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable>
    </Flex>
  );
};

export default UserAction;
