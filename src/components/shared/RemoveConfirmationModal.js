import { Dimensions, Image, Platform, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import Modal from "react-native-modal";

import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";

const RemoveConfirmationModal = ({ isOpen, toggle, onPress, description, isLoading }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal isVisible={isOpen} onBackdropPress={toggle} deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
      <View style={styles.container}>
        <View style={{ display: "flex", alignItems: "center" }}>
          {/* <Image source={require("../../assets/vectors/confirmation.jpg")} alt="confirmation" style={styles.image} /> */}
          <Text style={[{ textAlign: "center" }, TextProps]}>{description}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Button onPress={!isLoading && toggle} variant="outline" flex={1}>
            <Text style={TextProps}>Cancel</Text>
          </Button>
          <Button flex={1} disabled={isLoading} backgroundColor="#E53935" onPress={onPress}>
            {isLoading ? <ActivityIndicator /> : <Text style={{ fontSize: 12, color: "#FFFFFF" }}>Confirm</Text>}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveConfirmationModal;

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
