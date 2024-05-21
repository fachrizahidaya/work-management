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
            date={item?.date}
            shift={item?.shift}
            pic={item?.person_in_charge}
            navigation={navigation}
            dayjs={dayjs}
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
