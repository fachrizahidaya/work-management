import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const ChatOptionMenu = ({
  optionIsOpen,
  onClose,
  setMessageToReply,
  chat,
  toggleDeleteModal,
  placement,
  setDeleteSelected,
  deleteSelected,
  copyToClipboard,
  navigation,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const options = [
    {
      name: "Reply",
      icon: "reply-outline",
      onPress: () => {
        setMessageToReply(chat);
        onClose();
      },
      color: "#176688",
    },
    {
      name: "Forward",
      icon: "share",
      onPress: () => {
        navigation.push("Forward Screen", {
          message: chat?.message,
          project: chat?.project,
          task: chat?.task,
          file_path: chat?.file_path,
          file_name: chat?.file_name,
          file_size: chat?.file_size,
          mime_type: chat?.mime_type,
        });
        onClose();
      },
      color: "#176688",
    },
    {
      name: "Copy",
      icon: "content-copy",
      onPress: () => {
        copyToClipboard(chat?.message);
        onClose();
      },
      color: "#176688",
    },
    // {
    //   name: "Report",
    //   icon: "alert-outline",
    //   onPress: null,
    //   color: "#FF0303",
    // },
    {
      name: "Delete",
      icon: "trash-can-outline",
      onPress: () => {
        if (Platform.OS === "android") {
          toggleDeleteModal();
          onClose();
        } else {
          // toggleDeleteModal();
          setDeleteSelected(true);
          onClose();
        }
      },
      color: "#FF0303",
    },
  ];

  return (
    <>
      <Modal
        isVisible={optionIsOpen}
        onBackdropPress={() => {
          onClose();
          setDeleteSelected(false);
        }}
        backdropColor="#272A2B"
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
        hideModalContentWhileAnimating={true}
        useNativeDriver={false}
        onModalHide={() => {
          if (Platform.OS === "android") {
            null;
          } else {
            if (deleteSelected) {
              toggleDeleteModal();
            } else {
              null;
            }
          }
        }}
      >
        <View style={{ ...styles[placement], width: 200 }}>
          <View style={{ backgroundColor: "#FFFFFF", padding: 15, gap: 10, borderRadius: 15 }}>
            {options.map((option, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={option.onPress}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomColor: "#F6F6F6",
                  }}
                >
                  <Text style={[{ fontSize: 16 }, TextProps]}>{option.name}</Text>
                  <MaterialCommunityIcons name={option.icon} size={25} color={option.color} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChatOptionMenu;

const styles = {
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
};
