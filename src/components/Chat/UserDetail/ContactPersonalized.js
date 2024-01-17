import { View, Text } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const ContactPersonalized = () => {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 5,
      }}
    >
      <View>
        <Text style={[{ fontSize: 14 }, TextProps]}>Search message</Text>
      </View>

      <View>
        <Text style={[{ fontSize: 14 }, TextProps]}>Mute notifications</Text>
      </View>
    </View>
  );
};

export default ContactPersonalized;
