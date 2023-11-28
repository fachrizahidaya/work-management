import { Flex, Icon, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const MenuHeader = ({
  fileAttachment,
  toggleSearch,
  toggleExitModal,
  toggleDeleteGroupModal,
  toggleDeleteModal,
  type,
  active_member,
  onUpdatePinHandler,
  roomId,
  isPinned,
}) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Menu
        w={160}
        mt={10}
        trigger={(trigger) => {
          return fileAttachment ? null : (
            <Pressable {...trigger} mr={1}>
              <Icon as={<MaterialIcons name="more-horiz" />} color="black" size="md" />
            </Pressable>
          );
        }}
      >
        {/* <Menu.Item onPress={toggleSearch}>
          <Text>Search</Text>
        </Menu.Item> */}
        <Menu.Item onPress={() => onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin")}>
          <Text>{isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}</Text>
        </Menu.Item>

        {type === "group" ? (
          <>
            {active_member === 1 ? (
              <Menu.Item onPress={toggleExitModal}>
                <Text>Exit Group</Text>
              </Menu.Item>
            ) : (
              <Menu.Item onPress={toggleDeleteGroupModal}>
                <Text>Delete Group</Text>
              </Menu.Item>
            )}
          </>
        ) : (
          <>
            <Menu.Item onPress={toggleDeleteModal}>
              <Text>Delete Chat</Text>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Flex>
  );
};

export default MenuHeader;
