import React from "react";

import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const KPIDetailItem = ({
  target,
  achievement,
  description,
  handleOpen,
  item,
  employeeKpiValue,
  status,
}) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() => {
        if (status === "ongoing") {
          handleOpen(item, employeeKpiValue);
        } else {
          null;
        }
      }}
    >
      <Text style={[TextProps]}>{description}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons
          name={"chart-bar"}
          size={15}
          style={{ opacity: 0.5 }}
        />

        <Text style={[TextProps]}>{achievement || 0} of</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
    </Pressable>
  );
};

export default KPIDetailItem;
