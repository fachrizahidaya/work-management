import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const ContactMenu = ({
  contact,
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
  navigation,
}) => {
  const menuOptions = [
    // {
    // id: 1,
    //   icon: "volume-off",
    //   name: "Mute Notifications",
    //   color: "#176688",
    //   onPress: null
    // },
    {
      id: 2,
      icon: "information-outline",
      name: "Contact Info",
      color: "#176688",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        navigation.navigate("User Detail", {
          navigation: navigation,
          name: contact?.pin_group ? contact?.name : contact?.user?.name,
          image: contact?.pin_group ? contact?.image : contact?.user?.image,
          position: contact?.pin_group ? null : contact?.user?.user_type,
          email: contact?.pin_group ? null : contact?.user?.email,
          type: contact?.pin_personal ? "personal" : "group",
          roomId: contact?.id,
          loggedInUser: loggedInUser,
          active_member: contact?.active_member,
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
      id: 3,
      icon: "close-circle-outline",
      name: "Clear Chat",
      color: "#176688",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        toggleClearChatMessage(contact);
      },
    },
    {
      id: 5,
      icon: "trash-can-outline",
      name: `Delete ${contact?.pin_group ? contact?.name : contact?.user?.name}`,
      color: "#EB0E29",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        contact?.pin_group ? toggleDeleteGroupModal(contact) : toggleDeleteModal(contact);
      },
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AvatarPlaceholder
            size="md"
            name={contact?.pin_group ? contact?.name : contact?.user?.name}
            image={contact?.pin_group ? contact?.image : contact?.user?.image}
          />
          <Text style={{ fontSize: 16, fontWeight: "700" }}>
            {contact?.pin_group ? contact?.name : contact?.user?.name}
          </Text>
        </View>
      </View>

      <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
        {menuOptions.splice(0, 2).map((option, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={option.onPress}
              style={{
                ...styles.container,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text style={[{ fontSize: 16 }, TextProps]}>{option.name}</Text>
              <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10, marginTop: 3 }}>
        {menuOptions.splice(0, 1).map((option, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={option.onPress}
              style={{
                ...styles.container,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#E53935" }}>{option.name}</Text>
              <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
            </TouchableOpacity>
          );
        })}
        {!contact?.active_member
          ? menuOptions.map((option, index) => {
              return (
                <View key={index} style={styles.container}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#E53935" }}>{option.name}</Text>
                  <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
};

export default ContactMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 21,
    paddingBottom: -20,
  },
});
