import { Icon } from "native-base";
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
      <Icon as={<MaterialCommunityIcons name="email-outline" />} size={!size ? 5 : size} />
    </TouchableOpacity>
  );
};

export default EmailButton;
