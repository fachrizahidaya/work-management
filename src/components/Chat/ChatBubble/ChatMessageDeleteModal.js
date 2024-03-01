import { Dimensions, Platform, Text, View, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

import Button from "../../shared/Forms/Button";

const ChatMessageDeleteModal = ({
  id,
  myMessage,
  deleteModalChatIsOpen,
  toggleDeleteModalChat,
  onDeleteMessage,
  isLoading,
  isDeleted,
  setDeleteSelected,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal
      isVisible={deleteModalChatIsOpen}
      onBackdropPress={() => {
        if (Platform.OS === "android") {
          toggleDeleteModalChat();
        } else {
          toggleDeleteModalChat();
          setDeleteSelected(false);
        }
      }}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      backdropColor="#272A2B"
      hideModalContentWhileAnimating={true}
      useNativeDriver={false}
    >
      <View style={{ backgroundColor: "#FFFFFF", padding: 15, borderRadius: 10, gap: 10 }}>
        <View>
          <Text style={[{ fontSize: 14, fontWeight: "500" }]}>Delete message?</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
          <Button padding={10} variant="outline" onPress={toggleDeleteModalChat}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#377893" }}>Cancel</Text>
          </Button>

          <Button
            padding={10}
            disabled={isLoading}
            variant="outline"
            onPress={async () => {
              await onDeleteMessage(id, "me");
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#377893" }}>
              {isLoading ? <ActivityIndicator /> : "Delete for Me"}
            </Text>
          </Button>

          {myMessage && !isDeleted && (
            <Button
              padding={10}
              disabled={isLoading}
              variant="outline"
              onPress={async () => {
                await onDeleteMessage(id, "everyone");
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#377893" }}>
                {isLoading ? <ActivityIndicator /> : "Delete for Everyone"}
              </Text>
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ChatMessageDeleteModal;
