import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import { CopyToClipboard } from "../../shared/CopyToClipboard";

const ReceiptPurchaseOrderListItem = ({ navigation, id, receipt_no, receipt_date }) => {
  return (
    <TouchableOpacity
      style={{
        ...card.card,
        ...styles.content,
      }}
      onPress={() => navigation.navigate("Receipt Purchase Order Detail", { id: id })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Text style={[TextProps]}>{receipt_no}</Text>
        <MaterialCommunityIcons name="content-copy" size={12} onPress={() => CopyToClipboard(receipt_no)} />
      </View>
      <View style={styles.data}>
        <Text style={[TextProps]}>Receipt Date</Text>
        <Text style={[TextProps, { opacity: 0.5, textAlign: "right", width: "60%" }]}>{receipt_date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReceiptPurchaseOrderListItem;

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
});
