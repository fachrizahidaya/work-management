import { useNavigation } from "@react-navigation/native";
import { Image } from "native-base";
import { TouchableOpacity } from "react-native";

const PersonalNestButton = ({ height, width, email, user_id, user_name, user_type, user_image, room_id }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
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
