import { Icon } from "native-base";
import { Linking, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const WhatsappButton = ({ phone, size }) => {
  /**
   * Link to whatsapp from phone number handler
   */
  const handleWhatsappPress = () => {
    try {
      const whatsappUrl = `whatsapp://send?phone=+62${phone}`;
      Linking.openURL(whatsappUrl);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <TouchableOpacity onPress={handleWhatsappPress}>
      <Icon as={<MaterialCommunityIcons name="whatsapp" />} size={size ? size : 5} />
    </TouchableOpacity>
  );
};

export default WhatsappButton;
