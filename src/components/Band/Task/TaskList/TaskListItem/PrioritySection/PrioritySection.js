import React from "react";

import { View } from "react-native";

const PrioritySection = ({ priority }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <View style={{ backgroundColor: "#49C96D", width: 10, height: 10, borderRadius: 50 }} />
      {(priority === "Medium" || priority === "High") && (
        <View style={{ backgroundColor: "#FF965D", width: 10, height: 10, borderRadius: 50 }} />
      )}
      {priority === "High" && <View style={{ backgroundColor: "#FD7972", width: 10, height: 10, borderRadius: 50 }} />}
    </View>
  );
};

export default PrioritySection;
