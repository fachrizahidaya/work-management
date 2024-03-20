import React from "react";
import { Text, View } from "react-native";
import { TextProps } from "../../../shared/CustomStylings";

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <View style={{ gap: 10 }}>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>Attendance Type</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{type}</Text>
      </View>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>Reason</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{reason}</Text>
      </View>
    </View>
  );
};

export default LeaveOrPermit;
