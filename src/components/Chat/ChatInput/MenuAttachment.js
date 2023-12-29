import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ActionSheet from "react-native-actions-sheet";

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
        selectFile();
        onClose();
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: () => {
        pickImageHandler();
        onClose();
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
      {/* <Actionsheet.Content gap={1}> */}
      {attachmentOptions.map((option, index) => {
        return (
          <>
            {/* <Actionsheet.Item key={index} onPress={option.onPress} backgroundColor="#F5F5F5"> */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: 350 }}>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
              <MaterialCommunityIcons name={option.icon} color={option.color} />
            </View>
            {/* </Actionsheet.Item> */}
          </>
        );
      })}

      {/* <Actionsheet.Item onPress={onClose} mt={1} backgroundColor="#F5F5F5"> */}
      <View style={{ alignItems: "center", justifyContent: "center", width: 350 }}>
        <Text style={{ fontSize: 16, fontWeight: "400", color: "#176688" }}>Cancel</Text>
      </View>
      {/* </Actionsheet.Item> */}
      {/* </Actionsheet.Content> */}
    </ActionSheet>
  );
};

export default MenuAttachment;
