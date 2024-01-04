import { memo } from "react";
import dayjs from "dayjs";

import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../styles/Card";

const PayslipList = ({ id, month, year, openSelectedPayslip }) => {
  return (
    <View style={{ ...card.card, flexDirection: "column", marginHorizontal: 10, marginVertical: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
          {dayjs()
            .month(month - 1)
            .year(year)
            .format("MMMM YYYY")}
        </Text>

        <Pressable onPress={() => openSelectedPayslip(id)}>
          <MaterialCommunityIcons name="tray-arrow-down" size={20} color="#186688" />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(PayslipList);
