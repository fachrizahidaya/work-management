import { memo } from "react";

import { Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import AppraisalReviewListItem from "./AppraisalReviewListItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const AppraisalReviewList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  isLoading,
  refetch,
  navigation,
  dayjs,
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
              <AppraisalReviewListItem
                key={index}
                id={item?.id}
                start_date={item?.begin_date}
                end_date={item?.end_date}
                navigation={navigation}
                name={item?.employee?.name}
                target={item?.performance_appraisal?.target_name}
                dayjs={dayjs}
                target_level={item?.performance_appraisal?.target_level}
                description={item?.performance_appraisal?.review?.description}
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

export default memo(AppraisalReviewList);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
