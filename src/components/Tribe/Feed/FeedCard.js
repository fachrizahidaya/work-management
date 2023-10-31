import { useState } from "react";

import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";

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
   * Action sheet for comment handler
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
  };

  /**
   * Submit comment handler
   */
  const commentSubmitHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
  };

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
            post={item}
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
            onToggleLike={onToggleLike}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            onCommentToggle={commentsOpenHandler}
            refetch={refetchFeeds}
          />
        )}
      />

      {commentsOpen && (
        <FeedComment
          postId={postId}
          loggedEmployeeId={loggedEmployeeId}
          loggedEmployeeName={loggedEmployeeName}
          loggedEmployeeImage={loggedEmployeeImage}
          handleOpen={commentsOpenHandler}
          handleClose={commentsCloseHandler}
          refetchFeeds={refetchFeeds}
          postRefetchHandler={postRefetchHandler}
          onSubmit={commentSubmitHandler}
        />
      )}
    </Box>
  );
};

export default FeedCard;
