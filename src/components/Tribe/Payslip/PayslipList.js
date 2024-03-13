import { memo } from "react";
import dayjs from "dayjs";

import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const PayslipList = ({ id, month, year, openSelectedPayslip }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#ffffff",
        gap: 10,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 14,
        marginVertical: 8,
        marginTop: 10,
        elevation: 4,
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[{ fontSize: 14, color: "#3F434A" }, TextProps]}>
          {dayjs()
            .month(month - 1)
            .year(year)
            .format("MMMM YYYY")}
        </Text>

        <Pressable onPress={() => openSelectedPayslip(id)}>
          <MaterialCommunityIcons name="tray-arrow-down" size={20} color="#3F434A" />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(PayslipList);
