import React from "react";
import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const HistoryPerformanceListItem = ({ period, start_date, end_date, navigation }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate("Performance Detail")}
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
        <Text style={{ fontSize: 14, fontWeight: "500", opacity: 0.5 }}>Quarter {period}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[{ fontSize: 12 }, TextProps]}>{start_date} </Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>{end_date}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} />
    </Pressable>
  );
};

export default HistoryPerformanceListItem;
