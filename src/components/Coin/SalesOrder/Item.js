import { Pressable, StyleSheet, Text } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const Item = ({ name, qty, unit, total_amount, currencyConverter, toggleModal, data }) => {
  return (
    <Pressable onPress={() => toggleModal(data)} style={styles.container}>
      <Text style={[TextProps, { overflow: "hidden", width: 75 }]} ellipsizeMode="tail" numberOfLines={2}>
        {name}
      </Text>
      <Text style={[TextProps]}>
        {new Intl.NumberFormat("id-ID").format(qty)} {unit}
      </Text>
      <Text style={[TextProps]}>{currencyConverter.format(total_amount)}</Text>
    </Pressable>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EB",
    padding: 10,
  },
});
