import { View, Image, Pressable, StyleSheet, Platform } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImageAttachment = ({ image, setImage }) => {
  return (
    <View
      style={{
        ...styles.container,
        paddingTop: Platform.OS === "ios" ? 60 : null,
      }}
    >
      <View style={{ flexDirection: "row-reverse" }}>
        <Pressable onPress={() => setImage(null)}>
          <MaterialCommunityIcons name="close" size={20} />
        </Pressable>
      </View>
      <View style={{ alignSelf: "center" }}>
        <Image
          source={{ uri: image.uri }}
          style={{
            flex: 1,
            width: 350,
            height: 500,
            backgroundColor: "white",
            resizeMode: "contain",
          }}
          alt="image selected"
        />
      </View>
    </View>
  );
};

export default ImageAttachment;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
