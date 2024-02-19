import React from "react";
import dayjs from "dayjs";

import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const OngoingPerformanceListItem = ({ id, start_date, end_date, position, navigation, status, name, type, target }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 4,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() =>
        navigation.navigate("KPI Detail", {
          id: id,
        })
      }
    >
      <View style={{paddingVertical: 5,paddingHorizontal: 15, backgroundColor: "#D9D9D9", borderRadius: 15}}>
      <Text
        style={[ TextProps]}
      >
        {status || "Pending"}
      </Text>

      </View>
      <Text style={[TextProps]}>{name}</Text>
      <View>
        <Text style={[{ opacity: 0.5 }, TextProps]}>Position</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name="calendar-month" size={15} style={{ opacity: 0.5 }} />
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(start_date).format("DD MMM YYYY")} to</Text>
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(end_date).format("DD MMM YYYY")}</Text>
      </View>
    </Pressable>
  );
};

export default OngoingPerformanceListItem;
