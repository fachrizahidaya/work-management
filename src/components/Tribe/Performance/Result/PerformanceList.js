import { memo } from "react";

import { Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import PerformanceListItem from "./PerformanceListItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const PerformanceList = ({ data, isFetching, isLoading, refetch, navigation, dayjs, renderSkeletons }) => {
  return (
    <View style={{ flex: 1 }}>
      {!isLoading ? (
        data?.length > 0 ? (
          <FlashList
            data={data}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            refreshing={true}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
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
          />
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )
      ) : (
        <View style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
          <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
        </View>
      )}
    </View>
  );
};

export default memo(PerformanceList);

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
