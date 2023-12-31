import React from "react";

import { Dimensions, Image, Platform, Text, View } from "react-native";
import Modal from "react-native-modal";

const UserPreviewModal = ({ isOpen, onClose, name, image, email, stringToColor, userInitialGenerator }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal isVisible={isOpen} onBackdropPress={onClose} deviceHeight={deviceHeight} deviceWidth={deviceWidth}>
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <View style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {image ? (
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_API}/image/${image}`,
              }}
              alt={`profile image ${name}`}
              style={{ borderRadius: 50, resizeMode: "contain", height: 50, width: 50, backgroundColor: "transparent" }}
            />
          ) : (
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: stringToColor(name),
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: 500, fontSize: 20, color: "white" }}>{userInitialGenerator()}</Text>
            </View>
          )}
          <View style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 500 }}>{name || "Something went wrong"}</Text>
            <Text style={{ fontWeight: 400 }}>{email || "Something went wrong"}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserPreviewModal;
