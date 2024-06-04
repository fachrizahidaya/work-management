import { Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";
import { card } from "../../../styles/Card";

const DownPaymentListItem = ({ dp_no, status, dp_date, so_no, customer_name, payment_amount, currencyConverter }) => {
  const dataArr = [
    // { title: "DP Number", value: dp_no },
    { title: "SO Number", value: so_no },
    { title: "DP Date", value: dp_date },
    { title: "Customer", value: customer_name },
    { title: "Payment Amount", value: currencyConverter.format(payment_amount) },
  ];

  return (
    <View style={[card.card, styles.content]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={[TextProps]}>{dp_no}</Text>
          <MaterialCommunityIcons name="content-copy" size={12} onPress={() => CopyToClipboard(dp_no)} />
        </View>
        <View style={styles.status}>
          <Text style={[TextProps, { color: status === "Paid" ? "#21a143" : "#e56e18" }]}>{status}</Text>
        </View>
      </View>
      {dataArr.map((item, index) => {
        return (
          <View key={index} style={styles.data}>
            <Text style={[TextProps]}>{item.title}</Text>
            <Text style={[TextProps, { opacity: 0.5, textAlign: "right", width: "60%" }]}>
              {item.value ? item.value : "No Data"}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default DownPaymentListItem;

const styles = StyleSheet.create({
  content: {
    marginVertical: 4,
    justifyContent: "space-between",
    gap: 8,
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  status: {
    backgroundColor: "#fff7f2",
    borderRadius: 10,
    padding: 8,
    alignSelf: "flex-end",
  },
});
