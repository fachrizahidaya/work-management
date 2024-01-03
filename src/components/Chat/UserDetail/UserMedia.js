import { TouchableOpacity, View, Text, Pressable } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const UserMedia = ({ qty, navigation, media, docs }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 5,
      }}
    >
      <Pressable style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialIcons name="image" size={10} color="#377893" />
        <Text style={{ fontSize: 14, fontWeight: "400" }}>Media & Docs</Text>
      </Pressable>
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
        onPress={() =>
          navigation.navigate("Media", {
            media: media,
            docs: docs,
          })
        }
      >
        <Text style={{ fontSize: 14, fontWeight: "400", opacity: 0.5 }}>{qty}</Text>
        <MaterialIcons name="chevron-right" size={10} style={{ opacity: 0.5 }} />
      </TouchableOpacity>
    </View>
  );
};

export default UserMedia;
