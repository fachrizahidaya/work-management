import dayjs from "dayjs";

import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import DownPaymentListItem from "./DownPaymentListItem";

const DownPaymentList = ({
  data,
  isLoading,
  isFetching,
  renderSkeletons,
  fetchMore,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  currencyConverter,
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
              <DownPaymentListItem
                key={index}
                dp_no={item?.dp_no}
                status={item?.status}
                dp_date={dayjs(item?.dp_date).format("DD MMM YYYY")}
                shipping_address={item?.shipping_address}
                so_no={item?.sales_order_for_all?.so_no}
                customer_name={item?.customer_for_all?.name}
                payment_amount={item?.payment_amount}
                currencyConverter={currencyConverter}
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

export default DownPaymentList;

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
