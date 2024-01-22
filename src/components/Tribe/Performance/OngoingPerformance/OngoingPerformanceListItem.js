import React from "react";
import dayjs from "dayjs";

import { Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const OngoingPerformanceListItem = ({ start_date, end_date }) => {
  return (
    <View
      style={{
        ...card.card,
        marginVertical: 5,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <Text
        style={[{ paddingVertical: 5, paddingHorizontal: 15, backgroundColor: "#D9D9D9", borderRadius: 15 }, TextProps]}
      >
        Pending
      </Text>
      <View>
        <Text style={[{ opacity: 0.5 }, TextProps]}>Position</Text>
        <Text style={[TextProps]}>Front End Developer</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name="calendar-month" size={15} style={{ opacity: 0.5 }} />
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(start_date).format("DD MMM YYYY")} to</Text>
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(end_date).format("DD MMM YYYY")}</Text>
      </View>
    </View>
  );
};

export default OngoingPerformanceListItem;
