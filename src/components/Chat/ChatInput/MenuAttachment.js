import { Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuAttachment = ({
  isOpen,
  onClose,
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
        onClose();
        selectFile();
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: () => {
        onClose();
        pickImageHandler();
      },
    },
    {
      icon: "circle-slice-2",
      name: "Project/Task",
      color: "#EB0E29",
      onPress: () => {
        // selectBandHandler("project");
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
        onClose();
      },
    },
  ];

  return (
    <ActionSheet ref={reference} onClose={reference.current?.hide()}>
      {attachmentOptions.map((option, index) => {
        return (
          <TouchableOpacity
            onPress={option.onPress}
            style={{
              ...styles.wrapper,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
            <MaterialCommunityIcons name={option.icon} color={option.color} />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={onClose} style={{ ...styles.wrapper, alignItems: "center", justifyContent: "center" }}>
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
});
