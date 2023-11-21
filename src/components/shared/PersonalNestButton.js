import { useNavigation } from "@react-navigation/native";
import { Image } from "native-base";
import { TouchableOpacity } from "react-native";

const PersonalNestButton = ({ height, width, id, name, image, email, user_id, user_name, user_type, user_image }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chat Room", {
          name: user_name,
          userId: user_id,
          image: user_image,
          type: user_type,
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
