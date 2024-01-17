import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const OngoingPerformanceListItem = ({ type, period, start_date, end_date }) => {
  return (
    <View
      style={{
        ...card.card,
        borderWidth: 1,
        shadowOffset: 1,
        borderColor: "#E8E9EB",
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ fontSize: 14, fontWeight: "500", opacity: 0.5 }}>
          Quarter {period} • {type}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[{ fontSize: 12 }, TextProps]}>{start_date} </Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>{end_date}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} />
    </View>
  );
};

export default OngoingPerformanceListItem;
