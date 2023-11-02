import { useState } from "react";

import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useFetch } from "../../../hooks/useFetch";

const FeedCard = ({
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
  const [comments, setComments] = useState([]);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(null);

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 50,
  };

  const {
    data: commentData,
    isFetching: commentDataIsFetching,
    refetch: refetchCommentData,
  } = useFetch(`/hr/posts/${postId}/comment`, [reload, currentOffset], commentsFetchParameters);

  /**
   * Fetch more Comments handler
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + commentData?.data.length) {
      setCurrentOffset(currentOffset + 10);
    }
  };

  /**
   * Fetch from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffset(0);
    setReload(!reload);
  };

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
  const commentAddHandler = () => {
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
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshing={true}
        onScrollBeginDrag={() => {
          setHasBeenScrolled(true); // user has scrolled handler
        }}
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
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
          commentAddHandler={commentAddHandler}
          currentOffset={currentOffset}
          commentData={commentData}
          commentDataIsFetching={commentDataIsFetching}
          refetchCommentData={refetchCommentData}
          commentEndReachedHandler={commentEndReachedHandler}
          commentRefetchHandler={commentRefetchHandler}
          comments={comments}
          setComments={setComments}
        />
      )}
    </Box>
  );
};

export default FeedCard;
