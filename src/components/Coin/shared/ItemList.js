import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import Item from "./Item";
import AmountList from "../shared/AmountList";

const ItemList = ({
  header,
  isLoading,
  data,
  currencyConverter,
  discount,
  tax,
  sub_total,
  total_amount,
  toggleModal,
}) => {
  return (
    <>
      <View style={styles.wrapper}>
        <AmountList
          isLoading={isLoading}
          discount={discount}
          tax={tax}
          sub_total={sub_total}
          total_amount={total_amount}
        />
      </View>
      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 10, padding: 5 }}>
        <View style={styles.tableHeader}>
          {header.map((item, index) => {
            return <Text key={index}>{item.name}</Text>;
          })}
        </View>
        <View style={{ height: 300 }}>
          {!isLoading ? (
            data?.length > 0 ? (
              <FlashList
                data={data}
                keyExtractor={(item, index) => index}
                onEndReachedThreshold={0.1}
                estimatedItemSize={50}
                renderItem={({ item, index }) => (
                  <Item
                    data={item}
                    key={index}
                    name={item?.item?.name}
                    qty={item?.qty}
                    unit={item?.unit?.name}
                    total_amount={item?.total_amount}
                    currencyConverter={currencyConverter}
                    toggleModal={toggleModal}
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
      </View>
    </>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EB",
  },
});
