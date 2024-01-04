import { TouchableOpacity, Image, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MediaItem = ({ image, path, type, name }) => {
  return (
    <TouchableOpacity>
      {type === "application/pdf" ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <MaterialCommunityIcons name="delete-outline" size={10} color="#E53935" />
          <Text style={{ color }} color="#F44336">
            {image}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${path}` }}
          alt="Chat Image"
          style={{
            width: 60,
            height: 60,
            borderRadius: 5,
            resizeMode: "contain",
          }}
          resizeMethod="auto"
        />
      )}
    </TouchableOpacity>
  );
};

export default MediaItem;
