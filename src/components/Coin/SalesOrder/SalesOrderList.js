import dayjs from "dayjs";

import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import SalesOrderListItem from "./SalesOrderListItem";

const SalesOrderList = ({
  data,
  isLoading,
  isFetching,
  renderSkeletons,
  fetchMore,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  navigation,
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
              <SalesOrderListItem
                key={index}
                id={item?.id}
                so_no={item?.so_no}
                status={item?.status}
                so_date={dayjs(item?.so_date).format("DD MMM YYYY")}
                shipping_address={item?.shipping_address}
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

export default SalesOrderList;

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