import { Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuAttachment = ({
  selectFile,
  pickImageHandler,
  navigation,
  bandAttachment,
  setBandAttachment,
  bandAttachmentType,
  setBandAttachmentType,
  userId,
  name,
  roomId,
  image,
  position,
  email,
  type,
  active_member,
  isPinned,
  reference,
}) => {
  const attachmentOptions = [
    {
      icon: "file-document-outline",
      name: "Document",
      color: "#1E4AB9",
      onPress: () => {
        reference.current?.hide();
        selectFile();
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: () => {
        reference.current?.hide();
        pickImageHandler();
      },
    },
    {
      icon: "circle-slice-2",
      name: "Project/Task",
      color: "#EB0E29",
      onPress: () => {
        navigation.navigate("Project Screen", {
          bandAttachment: bandAttachment,
          setBandAttachment: setBandAttachment,
          bandAttachmentType: bandAttachmentType,
          setBandAttachmentType: setBandAttachmentType,
          userId: userId,
          name: name,
          roomId: roomId,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          isPinned: isPinned,
        });
        reference.current?.hide();
      },
    },
  ];

  return (
    <ActionSheet ref={reference} onClose={reference.current?.hide()}>
      {attachmentOptions.map((option, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={option.onPress}
            style={{
              ...styles.wrapper,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
            <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        onPress={() => reference.current?.hide()}
        style={{ ...styles.wrapper, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 16, fontWeight: "400", color: "#176688" }}>Cancel</Text>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default MenuAttachment;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
