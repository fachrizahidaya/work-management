import { Linking, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EmailButton = ({ email, size }) => {
  /**
   * Link to email form from email address handler
   */
  const handleEmailPress = () => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity onPress={handleEmailPress}>
      <MaterialCommunityIcons name="email-outline" size={!size ? 10 : size} color="#3F434A" />
    </TouchableOpacity>
  );
};

export default EmailButton;
