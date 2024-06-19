import dayjs from "dayjs";

import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import SalesOrderListItem from "./SalesOrderListItem";

const height = Dimensions.get("screen").height - 300;

const SalesOrderList = ({
  data,
  isFetching,
  isLoading,
  refetch,
  fetchMore,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      {data.length > 0 || filteredData?.length ? (
        <FlashList
          data={data.length ? data : filteredData}
          onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          onEndReached={hasBeenScrolled ? fetchMore : null}
          ListFooterComponent={() => isLoading && <ActivityIndicator />}
          refreshing={true}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
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
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
          <View style={styles.content}>
            <EmptyPlaceholder height={200} width={240} text="No data" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SalesOrderList;

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
