import { View, Pressable, Text } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const DateSection = ({ start, end }) => {
  return (
    <Pressable
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={[{ fontSize: 12 }, TextProps]}>Start</Text>
        <Text style={{ fontSize: 12, fontWeight: "500" }}>{start}</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={[{ fontSize: 12 }, TextProps]}>Due</Text>
        <Text style={{ fontSize: 12, fontWeight: "500" }}>{end}</Text>
      </View>
    </Pressable>
  );
};

export default DateSection;
