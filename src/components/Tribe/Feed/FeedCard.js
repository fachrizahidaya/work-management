import { useState } from "react";

import { Box, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../shared/ToastDialog";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  postRefetchHandler,
  postEndReachedHandler,
  hasBeenScrolled,
  setHasBeenScrolled,
  reload,
  setReload,
  postIsFetching,
  refetchPost,
}) => {
  const [comments, setComments] = useState([]);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);

  const toast = useToast();

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 50,
  };

  const {
    data: comment,
    isFetching: commentIsFetching,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [reload, currentOffset], commentsFetchParameters);

  /**
   * Fetch more Comments handler
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + comment?.data.length) {
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
    setForceRerender(!forceRerender);
  };

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPost();
      console.log("Process success");
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Process error, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  };

  return (
    <Box flex={1}>
      <FlashList
        data={posts}
        extraData={forceRerender} // re-render data handler
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
            refreshing={postIsFetching}
            onRefresh={() => {
              postRefetchHandler();
              refetchPost();
            }}
          />
        }
        renderItem={({ item, index }) => (
          <FeedCardItem
            key={index}
            id={item?.id}
            employeeId={item?.author_id}
            employeeName={item?.employee_name}
            employeeImage={item?.employee_image}
            createdAt={item?.created_at}
            content={item?.content}
            total_like={item?.total_like}
            totalComment={item?.total_comment}
            likedBy={item?.liked_by}
            attachment={item?.file_path}
            type={item?.type}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            onToggleLike={postLikeToggleHandler}
            onCommentToggle={commentsOpenHandler}
          />
        )}
      />

      {commentsOpen && (
        <FeedComment
          postId={postId}
          loggedEmployeeId={loggedEmployeeId}
          loggedEmployeeName={loggedEmployeeName}
          loggedEmployeeImage={loggedEmployeeImage}
          currentOffset={currentOffset}
          comment={comment}
          comments={comments}
          setComments={setComments}
          commentIsFetching={commentIsFetching}
          refetchComment={refetchComment}
          handleOpen={commentsOpenHandler}
          handleClose={commentsCloseHandler}
          commentAddHandler={commentAddHandler}
          commentEndReachedHandler={commentEndReachedHandler}
          commentRefetchHandler={commentRefetchHandler}
        />
      )}
    </Box>
  );
};

export default FeedCard;
