import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import CourierPickupItem from "./CourierPickupItem";

const CourierPickupList = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        renderItem={({ item }) => (
          <CourierPickupItem awb={item?.awb_no} courier={item?.courier?.name} image={item?.courier?.image} />
        )}
      />
    </View>
  );
};

export default CourierPickupList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
});
