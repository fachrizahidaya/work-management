import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import Item from "./Item";

const ItemList = ({ header, isLoading, data }) => {
  return (
    <>
      <View style={styles.tableHeader}>
        {header.map((item, index) => {
          return <Text key={index}>{item.name}</Text>;
        })}
      </View>
      <View style={{ height: "40%" }}>
        {!isLoading ? (
          data?.length > 0 ? (
            <FlashList
              data={data}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              estimatedItemSize={50}
              renderItem={({ item, index }) => (
                <Item
                  key={index}
                  name={item?.item?.name}
                  qty={item?.qty}
                  unit={item?.unit?.name}
                  warehouse={item?.warehouse?.name}
                />
              )}
            />
          ) : (
            <EmptyPlaceholder height={200} width={240} text="No data" />
          )
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EB",
  },
});
