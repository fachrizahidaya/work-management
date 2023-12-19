import { Icon, Modal } from "native-base";
import { Linking, StyleSheet, TouchableOpacity, View, Image } from "react-native";

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
    <Modal backgroundColor="#272A2B" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
          alt="Feed Image"
          style={styles.image}
        />
        <View style={styles.actionGroup}>
          <TouchableOpacity onPress={() => attachmentDownloadHandler(file_path)}>
            <Icon as={<MaterialCommunityIcons name="download" />} size={6} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFullScreen(false)}>
            <Icon as={<MaterialCommunityIcons name="close" />} size={6} color="#FFFFFF" />
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
    paddingRight: 5,
    paddingTop: 5,
    gap: 5,
  },
});
