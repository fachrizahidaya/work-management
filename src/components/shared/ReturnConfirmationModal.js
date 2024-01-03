import { View, Text, Image, Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";

import Button from "./Forms/Button";

const ReturnConfirmationModal = ({ isOpen, toggle, onPress, description }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal isVisible={isOpen} onBackdropPress={toggle} deviceHeight={deviceHeight} deviceWidth={deviceWidth}>
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Image
            source={require("../../assets/vectors/confirmation.jpg")}
            alt="confirmation"
            style={{
              height: 150,
              width: 180,
              resizeMode: "contain",
            }}
          />
          <Text style={{ textAlign: "center" }}>{description}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Button onPress={toggle} flex={1} variant="outline" backgroundColor="#FD7972">
            <Text>Cancel</Text>
          </Button>

          <Button backgroundColor="#E53935" onPress={onPress} flex={1}>
            <Text style={{ color: "#FFFFFF" }}>Confirm</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ReturnConfirmationModal;
