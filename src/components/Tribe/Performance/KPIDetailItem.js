import React from "react";

import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const KPIDetailItem = ({ question, actual, target, reference }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 5,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() => reference.current?.show("KPI Detail")}
    >
      <Text style={[TextProps]}>{question}</Text>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <MaterialCommunityIcons name="chart-bar" size={15} style={{ opacity: 0.5 }} />
        <Text style={[TextProps]}>{actual} of</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
    </Pressable>
  );
};

export default KPIDetailItem;
