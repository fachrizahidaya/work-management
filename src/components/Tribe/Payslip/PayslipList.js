import { memo } from "react";

import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import PayslipItem from "./PayslipItem";
import EmptyPlaceholder from "../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const PayslipList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  isLoading,
  refetch,
  openSelectedPayslip,
  renderSkeletons,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {!isLoading ? (
        data?.length > 0 ? (
          <FlashList
            data={data}
            keyExtractor={(item, index) => index}
            onScrollBeginDrag={() => setHasBeenScrolled(true)}
            onEndReachedThreshold={0.1}
            onEndReached={hasBeenScrolled ? fetchMore : null}
            estimatedItemSize={50}
            refreshing={true}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={() => {
                  refetch();
                }}
              />
            }
            ListFooterComponent={() => isFetching && <ActivityIndicator />}
            renderItem={({ item, index }) => (
              <PayslipItem
                key={index}
                id={item?.id}
                month={item?.pay_month}
                year={item?.pay_year}
                openSelectedPayslip={openSelectedPayslip}
              />
            )}
          />
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
            <View style={styles.wrapper}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )
      ) : (
        <View style={{ paddingHorizontal: 14 }}>
          <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
        </View>
      )}
    </View>
  );
};

export default memo(PayslipList);

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
