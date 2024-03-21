import React from "react";
import { Text, View } from "react-native";
import { TextProps } from "../../../../shared/CustomStylings";

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 14 }, TextProps]}>Attendance Type</Text>
        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, borderColor: "#E8E9EB" }}>
          <Text style={[{ fontSize: 14 }, TextProps]}>{type}</Text>
        </View>
      </View>
      {type === "Leave" ? null : (
        <View style={{ gap: 10 }}>
          <Text style={[{ fontSize: 14 }, TextProps]}>Reason</Text>
          <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, borderColor: "#E8E9EB" }}>
            <Text style={[{ fontSize: 14 }, TextProps]}>{reason}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default LeaveOrPermit;
