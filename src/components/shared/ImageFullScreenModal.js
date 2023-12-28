import Modal from "react-native-modal";
import { Linking, StyleSheet, TouchableOpacity, View, Image, Dimensions } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      isVisible={isFullScreen}
      onBackdropPress={() => setIsFullScreen(false)}
      backdropColor="#272A2B"
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
          alt="Feed Image"
          style={styles.image}
        />
        <View style={styles.actionGroup}>
          <TouchableOpacity onPress={() => attachmentDownloadHandler(file_path)}>
            <MaterialCommunityIcons name="download" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFullScreen(false)}>
            <MaterialCommunityIcons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImageFullScreenModal;

const styles = StyleSheet.create({
  imageBox: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: "contain",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    top: 0,
    gap: 5,
  },
});
