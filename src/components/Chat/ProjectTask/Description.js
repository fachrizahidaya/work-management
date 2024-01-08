import { View, ScrollView, Text } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const Description = ({ description }) => {
  return (
    <View
      style={{
        minHeight: 100,
        maxHeight: 150,
        backgroundColor: "#FFFFFF",
        gap: 5,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <ScrollView>
        <Text style={[{ fontSize: 14 }, TextProps]}>{description}</Text>
      </ScrollView>
    </View>
  );
};

export default Description;
