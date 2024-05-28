import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DataEntryItem from "./DataEntryItem";

const DataEntrySessions = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        renderItem={({ item }) => <DataEntryItem awb={item?.awb_no} courier={item?.courier?.name} />}
      />
    </View>
  );
};

export default DataEntrySessions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
});
