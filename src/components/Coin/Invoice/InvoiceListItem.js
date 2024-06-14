import { Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import { CopyToClipboard } from "../../shared/CopyToClipboard";

const InvoiceListItem = ({ id, navigation, invoice_no, status, invoice_date, shipping_address }) => {
  const dataArr = [
    // { title: "Invoice Number", value: invoice_no },
    { title: "Invoice Date", value: invoice_date },
    { title: "Shipping Address", value: shipping_address },
  ];

  return (
    <Pressable style={[card.card, styles.content]} onPress={() => navigation.navigate("Invoice Detail", { id: id })}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={[TextProps]}>{invoice_no}</Text>
          <MaterialCommunityIcons name="content-copy" size={12} onPress={() => CopyToClipboard(invoice_no)} />
        </View>
        <View style={styles.status}>
          <Text
            style={[
              TextProps,
              { color: status === "Finish" ? "#21a143" : status === "In Progress" ? "#43ac59" : "#e56e18" },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
      {dataArr.map((item, index) => {
        return (
          <View key={index} style={styles.data}>
            <Text style={[TextProps]}>{item.title}</Text>
            <Text style={[TextProps, { opacity: 0.5, textAlign: "right", width: "60%" }]}>{item.value}</Text>
          </View>
        );
      })}
    </Pressable>
  );
};

export default InvoiceListItem;

const styles = StyleSheet.create({
  content: {
    marginVertical: 4,
    marginHorizontal: 14,
    justifyContent: "space-between",
    gap: 8,
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  status: {
    backgroundColor: "#f0fbf3",
    borderRadius: 10,
    padding: 8,
    alignSelf: "flex-end",
  },
});
