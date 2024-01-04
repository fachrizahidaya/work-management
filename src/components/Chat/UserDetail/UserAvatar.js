import { StyleSheet, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserAvatar = ({ navigation, roomId, type, name, image, position, selectedMembers = [], currentUserIsAdmin }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", paddingBottom: 5 }}>
      <View style={{ gap: 10 }}>
        <AvatarPlaceholder size="xl" name={name} image={image} isThumb={false} />
        {type === "group" && currentUserIsAdmin ? (
          <Pressable
            style={styles.editPicture}
            onPress={() =>
              navigation.navigate("Edit Group", {
                type: type,
                name: name,
                image: image,
                roomId: roomId,
              })
            }
          >
            <MaterialCommunityIcons name="pencil" size={15} color="#3F434A" />
          </Pressable>
        ) : (
          <Pressable style={styles.editPicture}>
            <MaterialCommunityIcons name="checkbox-blank-circle" size={15} color="#49C96D" />
          </Pressable>
        )}
      </View>

      <Text style={{ fontSize: 16, fontWeight: "500" }}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>

      {type === "personal" ? (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 12, fontWeight: "400" }}>{position}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default UserAvatar;

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
