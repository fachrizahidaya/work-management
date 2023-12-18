import { Icon } from "native-base";
import { Linking, StyleSheet, Modal, View, Image, TouchableWithoutFeedback } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path }) => {
  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      style={styles.container}
      animationType="fade"
      visible={isFullScreen}
      onDismiss={() => setIsFullScreen(false)}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
          style={styles.image}
          alt="Feed Image"
        />
        <View style={styles.actionGroup}>
          <TouchableWithoutFeedback onPress={() => attachmentDownloadHandler(file_path)}>
            <Icon as={<MaterialCommunityIcons name="download" />} size={6} color="#FFFFFF" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setIsFullScreen(false)}>
            <Icon as={<MaterialCommunityIcons name="close" />} size={6} color="#FFFFFF" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

export default ImageFullScreenModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272A2B",
  },
  imageBox: {
    position: "relative",
  },
  image: {
    height: 300,
    width: 400,
    resizeMode: "contain",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    top: 0,
    paddingRight: 10,
    gap: 2,
  },
});
