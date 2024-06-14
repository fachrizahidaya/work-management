import { memo } from "react";

import { Dimensions, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";
import KPIReviewListItem from "./KPIReviewListItem";

const height = Dimensions.get("screen").height - 300;

const KPIReviewList = ({
  data,
  isFetching,
  isLoading,
  refetch,
  fetchMore,
  navigation,
  dayjs,
  hasBeenScrolled,
  setHasBeenScrolled,
  renderSkeletons,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {!isLoading ? (
        data?.length > 0 ? (
          <FlashList
            data={data}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
            onEndReached={hasBeenScrolled === true ? fetchMore : null}
            refreshing={true}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
            renderItem={({ item, index }) => (
              <KPIReviewListItem
                key={index}
                id={item?.id}
                start_date={item?.begin_date}
                end_date={item?.end_date}
                navigation={navigation}
                name={item?.employee?.name}
                target={item?.performance_kpi?.target_name}
                dayjs={dayjs}
                target_level={item?.performance_kpi?.target_level}
                description={item?.performance_kpi?.review?.description}
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
        <View style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
          <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
        </View>
      )}
    </View>
  );
};

export default memo(KPIReviewList);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
