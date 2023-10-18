import { Icon } from "native-base";
import { Linking, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PhoneButton = ({ phone, size }) => {
  const handleCallPress = () => {
    try {
      const phoneUrl = `tel:${phone}`;
      Linking.openURL(phoneUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity onPress={handleCallPress}>
      <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={!size ? 5 : size} />
    </TouchableOpacity>
  );
};

export default PhoneButton;
