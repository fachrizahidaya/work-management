import { View, ScrollView, Text } from "react-native";
import HTMLtoTextConverter from "./HTMLtoTextConverter";

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
        <HTMLtoTextConverter htmlString={description} />
      </ScrollView>
    </View>
  );
};

export default Description;
