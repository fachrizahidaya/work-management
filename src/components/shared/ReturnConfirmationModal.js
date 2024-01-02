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
    <Modal
      isVisible={isOpen}
      onBackdropPress={toggle}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      backdropColor="#FFFFFF"
    >
      <View style={{ alignItems: "center" }}>
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

      <View style={{ gap: 5 }}>
        <Button onPress={toggle} flex={1} variant="outline">
          Cancel
        </Button>

        <Button backgroundColor="#377893" onPress={onPress} flex={1}>
          Confirm
        </Button>
      </View>
    </Modal>
  );
};

export default ReturnConfirmationModal;
