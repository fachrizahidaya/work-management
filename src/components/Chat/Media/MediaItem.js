import { TouchableOpacity, Image, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MediaItem = ({ path, toggleFullScreen }) => {
  return (
    <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => toggleFullScreen(path)}>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${path}` }}
        alt="Chat Image"
        style={{
          width: 60,
          height: 60,
          borderRadius: 5,
          resizeMode: "cover",
        }}
        resizeMethod="auto"
      />
    </TouchableOpacity>
  );
};

export default MediaItem;
