import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";
import { card } from "../../../styles/Card";
import { CopyToClipboard } from "../../shared/CopyToClipboard";

const SalesOrderListItem = ({ id, so_no, navigation, status, so_date, shipping_address }) => {
  const dataArr = [
    // { title: "SO Number", value: so_no },
    { title: "SO Date", value: so_date },
    { title: "Shipping Address", value: shipping_address },
  ];

  return (
    <TouchableOpacity
      style={{
        ...card.card,
        ...styles.content,
      }}
      onPress={() => navigation.navigate("Sales Order Detail", { id: id })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={[TextProps]}>{so_no}</Text>
          <MaterialCommunityIcons name="content-copy" size={12} onPress={() => CopyToClipboard(so_no)} />
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
    </TouchableOpacity>
  );
};

export default SalesOrderListItem;

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
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
