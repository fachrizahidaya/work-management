import { memo } from "react";
import dayjs from "dayjs";

import { StyleSheet, View, Text, Pressable } from "react-native";
import { Icon } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../styles/Card";

const PayslipList = ({ id, month, year, openSelectedPayslip }) => {
  return (
    <View style={{ ...card.card, flexDirection: "column", marginHorizontal: 10, marginVertical: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
          {dayjs()
            .month(month - 1)
            .year(year)
            .format("MMMM YYYY")}
        </Text>

        <Pressable onPress={() => openSelectedPayslip(id)}>
          <Icon as={<MaterialCommunityIcons name="tray-arrow-down" />} size={6} color="#186688" />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(PayslipList);
