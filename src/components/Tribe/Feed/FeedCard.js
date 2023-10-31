import { useState } from "react";

import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useFetch } from "../../../hooks/useFetch";

const FeedCard = ({
  feeds,
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  onToggleLike,
  postRefetchHandler,
  postEndReachedHandler,
  feedsIsFetching,
  refetchFeeds,
  hasBeenScrolled,
  setHasBeenScrolled,
}) => {
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);
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
    refetchCommentData();
    refetchFeeds();
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
  };

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 50,
  };

  const {
    data: commentData,
    isFetching: commentDataIsFetching,
    refetch: refetchCommentData,
  } = useFetch(!fetchIsDone && `/hr/posts/${postId}/comment`, [currentOffset], commentsFetchParameters);

  return (
    <Box flex={1}>
      <FlashList
        data={posts}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        onEndReachedThreshold={0.1}
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshing={true}
        onScrollBeginDrag={() => {
          setHasBeenScrolled(true); // handler for the user has scrolled
        }}
        refreshControl={
          <RefreshControl
            refreshing={feedsIsFetching}
            onRefresh={() => {
              postRefetchHandler();
              refetchFeeds();
              // refetchCommentData();
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
          currentOffset={currentOffset}
          setCurrentOffset={setCurrentOffset}
          fetchIsDone={fetchIsDone}
          setFetchIsDone={setFetchIsDone}
          commentData={commentData}
          commentDataIsFetching={commentDataIsFetching}
          refetchCommentData={refetchCommentData}
        />
      )}
    </Box>
  );
};

export default FeedCard;
