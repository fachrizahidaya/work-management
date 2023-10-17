import { useNavigation } from "@react-navigation/native";
import { Image } from "native-base";
import { TouchableOpacity } from "react-native";

const PersonalNestButton = ({ height, width }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Chat List")}>
      <Image
        source={require("../../assets/icons/nest_logo.png")}
        alt="nest"
        style={{ height: height ? height : 20, width: width ? width : 20 }}
      />
    </TouchableOpacity>
  );
};

export default PersonalNestButton;
