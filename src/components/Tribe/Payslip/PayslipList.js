import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import PayslipItem from "./PayslipItem";
import { TextProps } from "../../shared/CustomStylings";

const PayslipList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  refetch,
  openSelectedPayslip,
}) => {
  return data.length > 0 ? (
    <View style={{ paddingHorizontal: 14, flex: 1 }}>
      <FlashList
        data={data}
        keyExtractor={(item, index) => index}
        onScrollBeginDrag={() => setHasBeenScrolled(true)}
        onEndReachedThreshold={0.1}
        onEndReached={hasBeenScrolled ? fetchMore : null}
        estimatedItemSize={50}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
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
    </View>
  ) : (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/vectors/empty.png")}
          alt="empty"
          style={{ resizeMode: "contain", height: 300, width: 300 }}
        />
        <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
      </View>
    </>
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
});
