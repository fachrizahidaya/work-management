import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const AmountList = ({ isLoading, discount, tax, sub_total, total_amount }) => {
  return !isLoading ? (
    <>
      <View style={{ gap: 5 }}>
        <Text style={[TextProps]}>Sub Total</Text>
        <View style={styles.wrapper}>
          <Text style={[TextProps, { opacity: 0.5 }]}>{sub_total ? sub_total : "No Data"}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <View style={{ gap: 5, flex: 0.5 }}>
          <Text style={[TextProps]}>Discount</Text>
          <View style={styles.wrapper}>
            <Text style={[TextProps, { opacity: 0.5 }]}>{discount ? discount : "No Data"}</Text>
          </View>
        </View>
        <View style={{ gap: 5, flex: 0.5 }}>
          <Text style={[TextProps]}>Tax</Text>
          <View style={styles.wrapper}>
            <Text style={[TextProps, { opacity: 0.5 }]}>{tax ? tax : "No Data"}</Text>
          </View>
        </View>
      </View>
      <View style={{ gap: 5 }}>
        <Text style={[TextProps]}>Total Amount</Text>
        <View style={styles.wrapper}>
          <Text style={[TextProps, { opacity: 0.5 }]}>{total_amount ? total_amount : "No Data"}</Text>
        </View>
      </View>
    </>
  ) : (
    <ActivityIndicator />
  );
};

export default AmountList;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
  },
});
