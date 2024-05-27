import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DataEntryItem from "./DataEntryItem";

const DataEntrySessions = ({ navigation, data, dayjs }) => {
  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        renderItem={({ item }) => (
          <DataEntryItem
            date={item?.createdAt}
            pic={item?.user?.name}
            navigation={navigation}
            dayjs={dayjs}
            awb={item?.awb_no}
            courier={item?.courier?.name}
          />
        )}
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
