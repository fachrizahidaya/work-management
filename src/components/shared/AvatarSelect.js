import { Image, Pressable, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "./AvatarPlaceholder";

const AvatarSelect = ({ imageAttachment, setImageAttachment, name, image, onAddImage }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!imageAttachment ? (
          <AvatarPlaceholder size="xl" name={name} image={!imageAttachment ? image : imageAttachment.uri} />
        ) : (
          <Image
            source={{
              uri: `${imageAttachment?.uri}`,
            }}
            alt="customer picture"
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
              borderRadius: 40,
            }}
          />
        )}
        <Pressable
          style={styles.editPicture}
          onPress={!imageAttachment ? () => onAddImage() : () => setImageAttachment(null)}
        >
          <MaterialCommunityIcons name={!imageAttachment ? "camera-outline" : "close"} size={20} color="#3F434A" />
        </Pressable>
      </View>
    </View>
  );
};

export default AvatarSelect;

const styles = StyleSheet.create({
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#C6C9CC",
    shadowOffset: 0,
  },
});
