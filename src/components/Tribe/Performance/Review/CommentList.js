import React from "react";
import { View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import CommentListItem from "./CommentListItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const CommentList = ({
  data,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMore,
  isFetching,
  refetch,
  navigation,
  dayjs,
}) => {
  return data?.length > 0 ? (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
        onEndReached={hasBeenScrolled === true ? fetchMore : null}
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
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      />
    </View>
  ) : (
    <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
      <View>
        <EmptyPlaceholder height={250} width={250} text="No Data" />
      </View>
    </ScrollView>
  );
};

export default CommentList;
