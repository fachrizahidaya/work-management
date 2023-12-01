import { Actionsheet, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ContactMenu = ({
  isOpen,
  onClose,
  chat,
  toggleDeleteModal,
  toggleDeleteGroupModal,
  toggleClearChatMessage,
  toggleContactInformation,
}) => {
  const menuOptions = [
    // {
    //   icon: "volume-off",
    //   name: "Mute Notifications",
    //   color: "#176688",
    //   onPress: null
    // },
    {
      icon: "information-outline",
      name: "Contact Info",
      color: "#176688",
      onPress: () => {
        toggleContactInformation(chat);
        onClose();
      },
    },
    {
      icon: "close-circle-outline",
      name: "Clear Chat",
      color: "#176688",
      onPress: () => {
        toggleClearChatMessage(chat);
        onClose();
      },
    },
    {
      icon: "minus-circle-outline",
      name: "Block",
      color: "#EB0E29",
      onPress: null,
    },
    {
      icon: "trash-can-outline",
      name: `Delete ${chat?.pin_group ? chat?.name : chat?.user?.name}`,
      color: "#EB0E29",
      onPress: () => {
        chat?.pin_group ? toggleDeleteGroupModal(chat) : toggleDeleteModal(chat);
        onClose();
      },
    },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content gap={1}>
        <Actionsheet.Item mt={1}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex gap={3} flexDirection="row" alignItems="center" width={350}>
              <AvatarPlaceholder
                size="md"
                name={chat?.pin_group ? chat?.name : chat?.user?.name}
                image={chat?.pin_group ? chat?.image : chat?.user?.image}
              />
              <Text fontSize={16} fontWeight={700}>
                {chat?.pin_group ? chat?.name : chat?.user?.name}
              </Text>
            </Flex>
            <Icon onPress={onClose} as={<MaterialCommunityIcons name="close" />} />
          </Flex>
        </Actionsheet.Item>

        <Box gap={1}>
          {menuOptions.splice(0, 2).map((option, index) => {
            return (
              <Actionsheet.Item borderRadius={10} key={index} onPress={option.onPress} backgroundColor="#F5F5F5">
                <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
                  <Text fontSize={16} fontWeight={400}>
                    {option.name}
                  </Text>
                  <Icon as={<MaterialCommunityIcons name={option.icon} />} color={option.color} size={5} />
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </Box>

        <Box gap={1} mt={2}>
          {menuOptions.splice(0, 1).map((option, index) => {
            return (
              <Actionsheet.Item borderRadius={10} key={index} onPress={option.onPress} backgroundColor="#F5F5F5">
                <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
                  <Text fontSize={16} fontWeight={700} color="red.600">
                    {option.name}
                  </Text>
                  <Icon as={<MaterialCommunityIcons name={option.icon} />} color={option.color} size={5} />
                </Flex>
              </Actionsheet.Item>
            );
          })}
          {!chat?.active_member
            ? menuOptions.map((option, index) => {
                return (
                  <Actionsheet.Item borderRadius={10} key={index} onPress={option.onPress} backgroundColor="#F5F5F5">
                    <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
                      <Text fontSize={16} fontWeight={700} color="red.600">
                        {option.name}
                      </Text>
                      <Icon as={<MaterialCommunityIcons name={option.icon} />} color={option.color} size={5} />
                    </Flex>
                  </Actionsheet.Item>
                );
              })
            : null}
        </Box>

        {/* <Actionsheet.Item onPress={onClose} mt={1} backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="center" alignItems="center">
            <Text fontSize={16} fontWeight={400} color="#176688">
              Cancel
            </Text>
          </Flex>
        </Actionsheet.Item> */}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ContactMenu;
