import { memo } from "react";
import dayjs from "dayjs";

import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const PayslipList = ({ id, month, year, openSelectedPayslip }) => {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 15,
        flexDirection: "column",
        marginVertical: 5,
        gap: 10,
        elevation: 4,
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: 4,
        marginBottom: 4,
        marginHorizontal: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
