import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Image, Platform } from "react-native";

const PersonalNestButton = ({ height, width, email, user_id, user_name, user_type, user_image, room_id, isPinned }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ flex: Platform.OS === "android" ? null : 1, zIndex: Platform.OS === "android" ? null : 7 }}
      onPress={() =>
        navigation.navigate("Chat Room", {
          name: user_name,
          userId: user_id,
          roomId: room_id,
          image: user_image,
          type: "personal",
          email: email,
          position: user_type,
          active_member: null,
          forwardedMessage: null,
          isPinned: isPinned,
        })
      }
    >
      <Image
        source={require("../../assets/icons/nest_logo.png")}
        alt="nest"
        style={{ height: height ? height : 20, width: width ? width : 20 }}
      />
    </TouchableOpacity>
  );
};

export default PersonalNestButton;
