import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Skeleton } from "moti/skeleton";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { SkeletonCommonProps, TextProps } from "../../shared/CustomStylings";
import { card } from "../../../styles/Card";

const SalesAndCustomerCard = ({
  customer_qty,
  customerIsLoading,
  invoiceIsLoading,
  total_sales,
  currencyConverter,
  monthlySalesPercentage,
  monthlyCustomerPercentage,
}) => {
  const { width } = Dimensions.get("screen");

  const dataArr = [
    {
      title: "Total Sales",
      value: currencyConverter.format(total_sales),
      icon: "signal-cellular-3",
      progressIcon:
        monthlySalesPercentage < 0 ? "arrow-down-thin" : monthlySalesPercentage == 0 ? "equal" : "arrow-up-thin",
      progressIconColor: monthlySalesPercentage < 0 ? "#FD7972" : monthlySalesPercentage == 0 ? "#8A9099" : "#49C96D",
      progressPercentage: Math.abs(monthlySalesPercentage) + "%",
    },
    {
      title: "Total Customer",
      value: new Intl.NumberFormat("id-ID").format(customer_qty),
      icon: "account-outline",
      progressIcon:
        monthlyCustomerPercentage < 0 ? "arrow-down-thin" : monthlyCustomerPercentage == 0 ? "equal" : "arrow-up-thin",
      progressIconColor:
        monthlyCustomerPercentage < 0 ? "#FD7972" : monthlyCustomerPercentage == 0 ? "#8A9099" : "#49C96D",
      progressPercentage: Math.abs(monthlyCustomerPercentage) + "%",
    },
  ];

  return (
    <View style={styles.container}>
      {!invoiceIsLoading ? (
        <TouchableOpacity style={{ ...card.card, ...styles.content }}>
          <View style={{ gap: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
              <Text style={[TextProps, { color: "#8A9099" }]}>{dataArr[0].title}</Text>
              <View style={{ backgroundColor: "#fff4ee", borderRadius: 20, padding: 10 }}>
                <MaterialCommunityIcons name={dataArr[0].icon} size={20} color="#FF965D" />
              </View>
            </View>

            <Text style={[TextProps]}>{dataArr[0].value}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name={dataArr[0].progressIcon} size={20} color={dataArr[0].progressIconColor} />

              <Text style={[TextProps, { color: dataArr[0].progressIconColor }]}>{dataArr[0].progressPercentage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <Skeleton width={width / 2 - 20} height={160} radius={20} {...SkeletonCommonProps} />
      )}

      {!customerIsLoading ? (
        <TouchableOpacity style={{ ...card.card, ...styles.content }}>
          <View style={{ gap: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
              <Text style={[TextProps, { color: "#8A9099" }]}>{dataArr[1].title}</Text>
              <View style={{ backgroundColor: "#fff4ee", borderRadius: 20, padding: 10 }}>
                <MaterialCommunityIcons name={dataArr[1].icon} size={20} color="#FF965D" />
              </View>
            </View>

            <Text style={[TextProps]}>{dataArr[1].value}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name={dataArr[1].progressIcon} size={20} color={dataArr[1].progressIconColor} />

              <Text style={[TextProps, { color: dataArr[1].progressIconColor }]}>{dataArr[1].progressPercentage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <Skeleton width={width / 2 - 20} height={160} radius={20} {...SkeletonCommonProps} />
      )}
    </View>
  );
};

export default SalesAndCustomerCard;

const styles = StyleSheet.create({
  container: {
    height: 160,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
