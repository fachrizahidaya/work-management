import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import Button from "../../shared/Forms/Button";

const ItemDetail = ({ backdropPress, visible, onClose, data, converter }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const detailArr = [
    {
      name: "Item",
      value: data?.item?.name,
    },
    {
      name: "Warehouse",
      value: data?.warehouse?.name,
    },
    {
      name: "Quantity",
      value: `${data?.qty} ${data?.unit?.name}`,
    },
    {
      name: "Discount",
      value: converter.format(data?.discount_amount),
    },
    {
      name: "Tax",
      value: converter.format(data?.tax),
    },
    {
      name: "Total Amount",
      value: converter.format(data?.total_amount),
    },
  ];

  return (
    <Modal isVisible={visible} onBackdropPress={backdropPress} deviceHeight={deviceHeight} deviceWidth={deviceWidth}>
      <View style={styles.container}>
        <View style={{ gap: 5 }}>
          {detailArr.map((item, index) => {
            return (
              <View key={index}>
                <Text>{item.name}:</Text>
                <Text>{item.value}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          <Button padding={5} onPress={onClose}>
            <Text style={{ color: "#FFFFFF" }}>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ItemDetail;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
});
