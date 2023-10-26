import { useState } from "react";

import { Box, Skeleton, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useEffect } from "react";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  onToggleLike,
  postRefetchHandler,
  handleEndReached,
  feedsIsFetching,
  refetchFeeds,
}) => {
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(null);

  /**
   * Action sheet control
   */
  const [commentsOpen, setCommentsOpen] = useState(false);
  const commentsOpenHandler = (post_id) => {
    setPostId(post_id);
    setCommentsOpen(true);
    const togglePostComment = posts.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  const commentsCloseHandler = () => {
    setCommentsOpen(false);
    setPostId(null);
    // refetchFeeds();
  };

  const commentSubmitHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
    // refetchFeeds();
  };

  useEffect(() => {
    refetchFeeds();
  }, [posts]);

  return (
    <Box flex={1}>
      <FlashList
        data={posts}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        onEndReachedThreshold={0.1}
        onEndReached={posts.length ? handleEndReached : null}
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl
            refreshing={feedsIsFetching}
            onRefresh={() => {
              postRefetchHandler();
              refetchFeeds();
            }}
          />
        }
        renderItem={({ item }) => (
          <FeedCardItem
            key={item?.id}
            id={item?.id}
            employeeId={item?.author_id}
            employeeName={item?.employee_name}
            createdAt={item?.created_at}
            employeeImage={item?.employee_image}
            content={item?.content}
            total_like={item?.total_like}
            totalComment={item?.total_comment}
            likedBy={item?.liked_by}
            attachment={item?.file_path}
            type={item?.type}
            // like post handler
            onToggleLike={onToggleLike}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            // toggle Comment
            onCommentToggle={commentsOpenHandler}
            refetch={refetchFeeds}
          />
        )}
      />

      {commentsOpen && (
        <FeedComment
          handleOpen={commentsOpenHandler}
          handleClose={commentsCloseHandler}
          postId={postId}
          total_comments={postTotalComment}
          onSubmit={commentSubmitHandler}
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          postRefetchHandler={postRefetchHandler}
          refetchFeeds={refetchFeeds}
        />
      )}
    </Box>
  );
};

export default FeedCard;
