import dayjs from "dayjs";

import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import ReceiptPurchaseOrderListItem from "./ReceiptPurchaseOrderListItem";

const ReceiptPurchaseOrderList = ({
  data,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  isFetching,
  isLoading,
  renderSkeletons,
  navigation,
  fetchMore,
}) => {
  return (
    <View style={styles.content}>
      {!isLoading ? (
        data.length > 0 || filteredData?.length ? (
          <FlashList
            data={data.length ? data : filteredData}
            onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            onEndReached={hasBeenScrolled ? fetchMore : null}
            ListFooterComponent={() => isFetching && <ActivityIndicator />}
            estimatedItemSize={70}
            renderItem={({ item, index }) => (
              <ReceiptPurchaseOrderListItem
                key={index}
                id={item?.id}
                receipt_no={item?.receipt_no}
                receipt_date={dayjs(item?.receipt_date).format("DD MMM YYYY")}
                navigation={navigation}
              />
            )}
          />
        ) : (
          <EmptyPlaceholder height={200} width={240} text="No data" />
        )
      ) : (
        <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
      )}
    </View>
  );
};

export default ReceiptPurchaseOrderList;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "#f8f8f8",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EB",
  },
});
