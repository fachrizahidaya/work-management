import React from "react";
import { Text, View } from "react-native";

const PerformancePoint = ({ period, point }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", opacity: 0.5 }}>{period}:</Text>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#377893" }}>{point} </Text>
        <Text style={{ fontSize: 14, fontWeight: "500", opacity: 0.5 }}>Points</Text>
      </View>
    </View>
  );
};

export default PerformancePoint;
