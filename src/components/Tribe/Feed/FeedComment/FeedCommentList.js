import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";

import FeedCommentItem from "./FeedCommentItem";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";

const FeedCommentList = ({
  comments,
  onReply,
  loggedEmployeeId,
  postId,
  latestExpandedReply,
  commentEndReachedHandler,
  commentsRefetchHandler,
  commentIsFetching,
  refetchComment,
  hasBeenScrolled,
  setHasBeenScrolled,
}) => {
  return (
    <GestureHandlerRootView>
      <Box flex={1} minHeight={2}>
        <FlashList
          data={comments}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          keyExtractor={(item, index) => item.id}
          onEndReachedThreshold={0.1}
          onScrollBeginDrag={() => setHasBeenScrolled(true)}
          onEndReached={hasBeenScrolled === true ? commentEndReachedHandler : null}
          estimatedItemSize={100}
          refreshControl={<RefreshControl refreshing={commentIsFetching} onRefresh={() => commentsRefetchHandler()} />}
          renderItem={({ item }) => (
            <FeedCommentItem
              key={item?.id}
              id={item?.id}
              parentId={item.parent_id ? item?.parent_id : item?.id}
              loggedEmployeeId={loggedEmployeeId}
              authorId={item?.employee_id}
              authorImage={item?.employee_image}
              authorName={item?.employee_name}
              totalReplies={item?.total_replies}
              postId={postId}
              onReply={onReply}
              latestExpandedReply={latestExpandedReply}
              comments={item?.comments}
            />
          )}
        />
      </Box>
    </GestureHandlerRootView>
  );
};

export default FeedCommentList;
