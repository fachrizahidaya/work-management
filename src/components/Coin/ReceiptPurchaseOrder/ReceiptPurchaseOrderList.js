import dayjs from "dayjs";

import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import ReceiptPurchaseOrderListItem from "./ReceiptPurchaseOrderListItem";

const height = Dimensions.get("screen").height - 300;

const ReceiptPurchaseOrderList = ({
  data,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  isFetching,
  isLoading,
  refetch,
  renderSkeletons,
  navigation,
  fetchMore,
}) => {
  return (
    <View style={styles.wrapper}>
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
            refreshing={true}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
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
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
            <View style={styles.content}>
              <EmptyPlaceholder height={200} width={240} text="No data" />
            </View>
          </ScrollView>
        )
      ) : (
        <View style={{ paddingHorizontal: 14, paddingVertical: 16, gap: 2 }}>{renderSkeletons()}</View>
      )}
    </View>
  );
};

export default ReceiptPurchaseOrderList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
  content: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
