import { memo } from "react";

import { Box, Spinner } from "native-base";
import { FlashList } from "@shopify/flash-list";

import FeedCommentItem from "./FeedCommentItem";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";

const FeedCommentList = ({
  comments,
  onReply,
  latestExpandedReply,
  commentEndReachedHandler,
  commentsRefetchHandler,
  commentIsFetching,
  commentIsLoading,
  refetchComment,
  hasBeenScrolled,
  setHasBeenScrolled,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  commentRepliesData,
  refetchCommentRepliesData,
  viewReplyToggle,
  setViewReplyToggle,
  hideReplies,
  setHideReplies,
}) => {
  return (
    <GestureHandlerRootView>
      <Box flex={1} height={540}>
        <FlashList
          data={comments}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          keyExtractor={(item, index) => item.id}
          onEndReachedThreshold={0.1}
          onScrollBeginDrag={() => setHasBeenScrolled(true)}
          ListFooterComponent={() => commentIsFetching && <Spinner />}
          onEndReached={hasBeenScrolled ? commentEndReachedHandler : null}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl
              refreshing={commentIsFetching}
              onRefresh={() => {
                commentsRefetchHandler();
                refetchComment();
              }}
            />
          }
          renderItem={({ item, index }) => (
            <FeedCommentItem
              key={index}
              parentId={item.parent_id ? item?.parent_id : item?.id}
              authorImage={item?.employee_image}
              authorName={item?.employee_name}
              totalReplies={item?.total_replies}
              comments={item?.comments}
              onReply={onReply}
              handleLinkPress={handleLinkPress}
              handleEmailPress={handleEmailPress}
              copyToClipboard={copyToClipboard}
              commentRepliesData={commentRepliesData}
              refetchCommentRepliesData={refetchCommentRepliesData}
              viewReplyToggle={viewReplyToggle}
              setViewReplyToggle={setViewReplyToggle}
              hideReplies={hideReplies}
              setHideReplies={setHideReplies}
            />
          )}
        />
      </Box>
    </GestureHandlerRootView>
  );
};

export default memo(FeedCommentList);
