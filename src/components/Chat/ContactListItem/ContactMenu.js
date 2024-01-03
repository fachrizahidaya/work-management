import { useNavigation } from "@react-navigation/native";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ContactMenu = ({
  onClose,
  chat,
  toggleDeleteModal,
  toggleDeleteGroupModal,
  toggleClearChatMessage,
  loggedInUser,
  toggleDeleteChatMessage,
  toggleExitModal,
  deleteModalIsOpen,
  exitModalIsOpen,
  deleteGroupModalIsOpen,
  deleteChatPersonal,
  deleteChatMessageIsLoading,
  chatRoomIsLoading,
  reference,
}) => {
  const navigation = useNavigation();
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
        onClose();
        navigation.navigate("User Detail", {
          navigation: navigation,
          name: chat?.pin_group ? chat?.name : chat?.user?.name,
          image: chat?.pin_group ? chat?.image : chat?.user?.image,
          position: chat?.pin_group ? null : chat?.user?.user_type,
          email: chat?.pin_group ? null : chat?.user?.email,
          type: chat?.pin_personal ? "personal" : "group",
          roomId: chat?.id,
          loggedInUser: loggedInUser,
          active_member: chat?.active_member,
          toggleDeleteModal: toggleDeleteModal,
          toggleExitModal: toggleExitModal,
          toggleDeleteGroupModal: toggleDeleteGroupModal,
          deleteModalIsOpen: deleteModalIsOpen,
          exitModalIsOpen: exitModalIsOpen,
          deleteGroupModalIsOpen: deleteGroupModalIsOpen,
          deleteChatPersonal: deleteChatPersonal,
          deleteChatMessageIsLoading: deleteChatMessageIsLoading,
          chatRoomIsLoading: chatRoomIsLoading,
          toggleDeleteChatMessage: toggleDeleteChatMessage,
          toggleClearChatMessage: toggleClearChatMessage,
        });
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
    // {
    //   icon: "minus-circle-outline",
    //   name: `Block ${chat?.pin_group ? chat?.name : chat?.user?.name}`,
    //   color: "#EB0E29",
    //   onPress: null,
    // },
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
    <ActionSheet ref={reference} onClose={onClose}>
      <View style={{ ...styles.wrapper, flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <AvatarPlaceholder
            size="md"
            name={chat?.pin_group ? chat?.name : chat?.user?.name}
            image={chat?.pin_group ? chat?.image : chat?.user?.image}
          />
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{chat?.pin_group ? chat?.name : chat?.user?.name}</Text>
        </View>
      </View>

      <View style={{ ...styles.wrapper, gap: 20 }}>
        {menuOptions.splice(0, 2).map((option, index) => {
          return (
            <>
              <TouchableOpacity key={index} onPress={option.onPress} style={styles.container}>
                <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
                <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
              </TouchableOpacity>
            </>
          );
        })}
      </View>

      <View style={{ ...styles.wrapper, gap: 5, marginTop: 5 }}>
        {menuOptions.splice(0, 1).map((option, index) => {
          return (
            <>
              <TouchableOpacity key={index} onPress={option.onPress} style={styles.container}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#E53935" }}>{option.name}</Text>
                <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
              </TouchableOpacity>
            </>
          );
        })}
        {!chat?.active_member
          ? menuOptions.map((option, index) => {
              return (
                <>
                  <View key={index} style={styles.container}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#E53935" }}>{option.name}</Text>
                    <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
                  </View>
                </>
              );
            })
          : null}
      </View>

      {/* <Actionsheet.Item onPress={onClose} mt={1} backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="center" alignItems="center">
            <Text fontSize={16} fontWeight={400} color="#176688">
              Cancel
            </Text>
          </Flex>
        </Actionsheet.Item> */}
      {/* </Actionsheet.Content> */}
    </ActionSheet>
  );
};

export default ContactMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
