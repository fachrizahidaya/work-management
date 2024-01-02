import { Dimensions, Image, Platform, Text, View, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

import Button from "./Forms/Button";

const RemoveConfirmationModal = ({ isOpen, toggle, onPress, description, isLoading }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal isVisible={isOpen} onBackdropPress={toggle} deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Image
            source={require("../../assets/vectors/confirmation.jpg")}
            alt="confirmation"
            style={{ height: 150, width: 150, resizeMode: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>{description}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Button
            onPress={!isLoading && toggle}
            variant="outline"
            padding={5}
            backgroundColor="#FFFFFF"
            children={<Text style={{ fontSize: 12, fontWeight: "500", color: "#000000" }}>Cancel</Text>}
          />
          <Button
            disabled={isLoading}
            backgroundColor="#E53935"
            padding={5}
            onPress={onPress}
            children={
              isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}>Confirm</Text>
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default RemoveConfirmationModal;
