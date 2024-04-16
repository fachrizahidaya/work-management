import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../shared/EmptyPlaceholder";
import SupplierListItem from "./SupplierListItem";

const SupplierList = ({
  data,
  isLoading,
  isFetching,
  renderSkeletons,
  fetchMore,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
}) => {
  return (
    <View style={styles.content}>
      {!isLoading ? (
        data.length > 0 || filteredData?.length ? (
          <>
            <FlashList
              data={data.length ? data : filteredData}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              onEndReached={hasBeenScrolled ? fetchMore : null}
              ListFooterComponent={() => isFetching && <ActivityIndicator />}
              estimatedItemSize={70}
              renderItem={({ item, index }) => (
                <SupplierListItem
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
          <EmptyPlaceholder height={200} width={240} text="No data" />
        )
      ) : (
        <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
      )}
    </View>
  );
};

export default SupplierList;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
  },
});
