import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import CourierItem from "./CourierItem";

const CourierList = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        renderItem={({ item, index }) => <CourierItem key={index} name={item?.name} />}
      />
    </View>
  );
};

export default CourierList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
});
