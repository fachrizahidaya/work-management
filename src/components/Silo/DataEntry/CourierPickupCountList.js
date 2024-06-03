import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import CourierPickupCountItem from "./CourierPickupCountItem";

const CourierPickupCountList = ({ totalData }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <FlashList
        data={totalData}
        estimatedItemSize={50}
        horizontal
        renderItem={({ item }) => <CourierPickupCountItem count={item?.total_scan} image={item?.courier?.image} />}
      />
    </View>
  );
};

export default CourierPickupCountList;
