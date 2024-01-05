import { Linking, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PhoneButton = ({ phone, size }) => {
  /**
   * Link to Caller from phone number handler
   */
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
      <MaterialCommunityIcons name="phone-outline" size={!size ? 10 : size} color="#3F434A" />
    </TouchableOpacity>
  );
};

export default PhoneButton;
