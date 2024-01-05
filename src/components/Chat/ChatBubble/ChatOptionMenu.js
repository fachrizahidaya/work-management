import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const ChatOptionMenu = ({ optionIsOpen, onClose, setMessageToReply, chat, toggleDeleteModal, placement }) => {
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
    // {
    //   name: "Forward",
    //   icon: "share",
    //   onPress: null,
    //   color: "#176688",
    // },
    // {
    //   name: "Copy",
    //   icon: "content-copy",
    //   onPress: null,
    //   color: "#176688",
    // },
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
        toggleDeleteModal();
        onClose();
      },
      color: "#FF0303",
    },
  ];

  return (
    <>
      {/* <Actionsheet isOpen={optionIsOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              setMessageToReply(chat);
              onClose();
            }}
          >
            Reply
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              toggleDeleteModal();
            }}
          >
            Delete
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet> */}
      <Modal
        isVisible={optionIsOpen}
        onBackdropPress={onClose}
        backdropColor="#272A2B"
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
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
