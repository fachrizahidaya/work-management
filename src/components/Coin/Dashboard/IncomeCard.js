import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Skeleton } from "moti/skeleton";

import { card } from "../../../styles/Card";
import { TextProps, SkeletonCommonProps } from "../../shared/CustomStylings";

const IncomeCard = ({ total_income, salesIsLoading, currencyConverter, monthlyIncomePercentage }) => {
  const { width } = Dimensions.get("screen");

  return !salesIsLoading ? (
    <TouchableOpacity style={{ ...card.card, ...styles.content }}>
      <View style={{ gap: 15 }}>
        <Text style={[TextProps, { color: "#8A9099" }]}>Total Income</Text>
        <Text style={[TextProps]}>{currencyConverter.format(total_income)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={
              monthlyIncomePercentage < 0 ? "arrow-down-thin" : monthlyIncomePercentage == 0 ? "equal" : "arrow-up-thin"
            }
            size={20}
            color={monthlyIncomePercentage < 0 ? "#FD7972" : monthlyIncomePercentage == 0 ? "#8A9099" : "#49C96D"}
          />
          <Text style={[TextProps, { color: "#49C96D" }]}>{Math.abs(monthlyIncomePercentage).toFixed(0) + "%"}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: "#fff4ee", borderRadius: 20, padding: 10 }}>
        <MaterialCommunityIcons name="currency-usd" size={75} color="#FF965D" />
      </View>
    </TouchableOpacity>
  ) : (
    <Skeleton width={width / 2 - 20} height={160} radius={20} {...SkeletonCommonProps} />
  );
};

export default IncomeCard;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
