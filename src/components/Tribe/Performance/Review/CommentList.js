import { memo } from "react";

import { Dimensions, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import CommentListItem from "./CommentListItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const CommentList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isLoading,
  isFetching,
  refetch,
  navigation,
  dayjs,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {data?.length > 0 ? (
        <FlashList
          data={data}
          estimatedItemSize={50}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
          onEndReached={hasBeenScrolled === true ? fetchMore : null}
          refreshing={true}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          ListFooterComponent={() => isLoading && <ActivityIndicator />}
          renderItem={({ item, index }) => (
            <CommentListItem
              key={index}
              id={item?.id}
              start_date={item?.begin_date}
              end_date={item?.end_date}
              navigation={navigation}
              name={item?.employee?.name}
              target={item?.performance_comment?.target_name}
              dayjs={dayjs}
              target_level={item?.performance_comment?.target_level}
              description={item?.performance_comment?.review?.description}
            />
          )}
        />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
          <View style={styles.wrapper}>
            <EmptyPlaceholder height={250} width={250} text="No Data" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default memo(CommentList);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
