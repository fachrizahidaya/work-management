import { StyleSheet, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const ContactAvatar = ({ navigation, roomId, type, name, image, position, currentUserIsAdmin }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        paddingBottom: 5,
        gap: 10,
      }}
    >
      <View style={{ gap: 10 }}>
        <AvatarPlaceholder size="xl" name={name} image={image} isThumb={false} />
        {type === "group" && currentUserIsAdmin ? (
          <Pressable
            style={styles.editPicture}
            onPress={() =>
              navigation.navigate("Edit Group", {
                name: name,
                image: image,
                roomId: roomId,
              })
            }
          >
            <MaterialCommunityIcons name="pencil" size={15} color="#3F434A" />
          </Pressable>
        ) : null}
      </View>

      <View>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>

        {type === "personal" ? (
          <View style={{ alignItems: "center" }}>
            <Text style={[{ fontSize: 12 }, TextProps]}>{position}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ContactAvatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C6C9CC",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    shadowOffset: 0,
  },
});
