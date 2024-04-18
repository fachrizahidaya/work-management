import { View, Pressable, Text } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const StatusSection = ({ open, onProgress, finish }) => {
  return (
    <Pressable
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        gap: 5,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#FF965D" }}>{open}</Text>
        <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>Open</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#304FFD" }}>{onProgress}</Text>
        <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>On Progress</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFD240" }}>{finish}</Text>
        <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>Finish</Text>
      </View>
    </Pressable>
  );
};

export default StatusSection;
