import { useNavigation } from "@react-navigation/native";

import { Actionsheet, Box, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatMenu = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const menuOptions = [
    {
      name: "New Chat",
      onPress: () => {
        onClose();
        navigation.navigate("New Chat");
      },
    },
    {
      name: "New Group",
      onPress: () => {
        onClose();
        navigation.navigate("Group Participant");
      },
    },
    // {
    //   name: "Select Message",
    // },
  ];
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content gap={1}>
        <Box gap={1}>
          {menuOptions.map((option, index) => {
            return (
              <Actionsheet.Item borderRadius={10} key={index} onPress={option.onPress} backgroundColor="#F5F5F5">
                <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
                  <Text fontSize={16} fontWeight={400}>
                    {option.name}
                  </Text>
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </Box>

        <Actionsheet.Item onPress={onClose} mt={1} backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="center" alignItems="center">
            <Text fontSize={16} fontWeight={400} color="#176688">
              Cancel
            </Text>
          </Flex>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChatMenu;
