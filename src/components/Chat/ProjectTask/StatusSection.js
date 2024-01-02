import { View, Pressable, Text } from "react-native";

const StatusSection = ({ open, onProgress, finish }) => {
  return (
    <Pressable
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 5,
        gap: 5,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#FF965D" }}>{open}</Text>
        <Text style={{ fontSize: 12, fontWeight: "400" }}>Open</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#304FFD" }}>{onProgress}</Text>
        <Text style={{ fontSize: 12, fontWeight: "400" }}>On Progress</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFD240" }}>{finish}</Text>
        <Text style={{ fontSize: 12, fontWeight: "400" }}>Finish</Text>
      </View>
    </Pressable>
  );
};

export default StatusSection;
