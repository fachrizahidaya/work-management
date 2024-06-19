import { View, Text, Image, Dimensions, Platform, StyleSheet } from "react-native";
import Modal from "react-native-modal";

import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";

const ReturnConfirmationModal = ({ isOpen, toggle, onPress, description }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal isVisible={isOpen} onBackdropPress={toggle} deviceHeight={deviceHeight} deviceWidth={deviceWidth}>
      <View style={styles.container}>
        <View style={{ display: "flex", alignItems: "center" }}>
          {/* <Image source={require("../../assets/vectors/confirmation.jpg")} alt="confirmation" style={styles.image} /> */}
          <Text style={[{ textAlign: "center" }, TextProps]}>{description}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Button onPress={toggle} flex={1} variant="outline" backgroundColor="#FD7972">
            <Text style={TextProps}>Cancel</Text>
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

const styles = StyleSheet.create({
  container: {
    gap: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: "contain",
  },
});
