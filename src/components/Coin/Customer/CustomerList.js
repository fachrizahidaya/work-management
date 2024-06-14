import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import CustomerListItem from "./CustomerListItem";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const height = Dimensions.get("screen").height - 300;

const CustomerList = ({
  data,
  isLoading,
  isFetching,
  refetch,
  renderSkeletons,
  fetchMore,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
}) => {
  return (
    <View style={styles.wrapper}>
      {!isLoading ? (
        data.length > 0 || filteredData?.length ? (
          <>
            <FlashList
              data={data.length ? data : filteredData}
              onScrollBeginDrag={() => setHasBeenScrolled(true)}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              onEndReached={hasBeenScrolled ? fetchMore : null}
              ListFooterComponent={() => isFetching && <ActivityIndicator />}
              estimatedItemSize={70}
              refreshing={true}
              refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
              renderItem={({ item, index }) => (
                <CustomerListItem
                  key={index}
                  name={item?.name}
                  phone={item?.phone}
                  address={item?.address}
                  email={item?.email}
                />
              )}
            />
          </>
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

export default CustomerList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
