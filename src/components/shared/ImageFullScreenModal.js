import { Linking, StyleSheet, TouchableOpacity, View, Image, Dimensions, Platform, ScrollView } from "react-native";
import Modal from "react-native-modal";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageFullScreenModal = ({ isFullScreen, setIsFullScreen, file_path, media, images }) => {
  const { width } = Dimensions.get("screen");
  const height = (width / 100) * 60;
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
      backdropColor={media ? "black" : "#272A2B"}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      {media ? (
        <View
          style={{
            width,
            height,
            position: "relative",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: -20, // handler margin left
          }}
        >
          <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} style={{ width, height }}>
            {images.map((item, index) => (
              <View>
                <Image
                  key={index}
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item}` }}
                  alt="Feed Image"
                  style={{ ...styles.image, width, height, resizeMode: "contain" }}
                />
                <View style={styles.actionGroupMedia}>
                  <TouchableOpacity
                    style={{ backgroundColor: "black", borderRadius: 20, padding: 5 }}
                    onPress={() => attachmentDownloadHandler(item)}
                  >
                    <MaterialCommunityIcons name="download" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: "black", borderRadius: 20, padding: 5 }}
                    onPress={() => setIsFullScreen(false)}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            style={{ width, height: 40 }}
          >
            {images.map((item, index) => (
              <View>
                <Image
                  key={index}
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item}` }}
                  alt="Feed Image"
                  style={{ width: 80, height: 80, resizeMode: "contain" }}
                />
              </View>
            ))}
          </ScrollView> */}
        </View>
      ) : (
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
            alt="Feed Image"
            style={styles.image}
          />
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={{ backgroundColor: "black", borderRadius: 20, padding: 5 }}
              onPress={() => attachmentDownloadHandler(file_path)}
            >
              <MaterialCommunityIcons name="download" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "black", borderRadius: 20, padding: 5 }}
              onPress={() => setIsFullScreen(false)}
            >
              <MaterialCommunityIcons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    height: 600,
    resizeMode: "cover",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    top: 10,
    gap: 5,
  },
  actionGroupMedia: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 10,
    top: 15,
    gap: 5,
  },
});
