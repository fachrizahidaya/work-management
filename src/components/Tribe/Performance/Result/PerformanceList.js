import { memo } from "react";

import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import PerformanceListItem from "./PerformanceListItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const PerformanceList = ({ data, isFetching, refetch, navigation, dayjs }) => {
  return data.length > 0 ? (
    <FlashList
      data={data}
      estimatedItemSize={50}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => index}
      // onScrollBeginDrag={() =>
      //   setPersonalHasBeenScrolled(!personalHasBeenScrolled)
      // }
      // onEndReached={
      //   personalHasBeenScrolled === true ? fetchMorePersonal : null
      // }
      renderItem={({ item, index }) => (
        <PerformanceListItem
          key={index}
          id={item?.id}
          start_date={item?.performance_review?.begin_date}
          end_date={item?.performance_review?.end_date}
          navigation={navigation}
          name={item?.employee?.name}
          target={null}
          dayjs={dayjs}
          description={item?.performance_review?.description}
          type="my-team"
        />
      )}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
    />
  ) : (
    <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
      <View style={styles.content}>
        <EmptyPlaceholder height={250} width={250} text="No Data" />
      </View>
    </ScrollView>
  );
};

export default memo(PerformanceList);

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
