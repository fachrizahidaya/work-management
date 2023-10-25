import { useState } from "react";

import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "../Feed/FeedCardItem";
import { LikeToggle } from "../../shared/LikeToggle";
import FeedComment from "../Feed/FeedComment/FeedComment";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  onToggleLike,
  postRefetchHandler,
  handleEndReached,
  personalFeedsIsFetching,
  refetchPersonalFeeds,
  refetchFeeds,
}) => {
  const [postId, setPostId] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);

  /**
   * Comments open handler
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
   * Comment submit handler
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
        keyExtractor={(item, index) => index}
        onEndReached={posts.length ? handleEndReached : null}
        onEndReachedThreshold={0.1}
        refreshControl={<RefreshControl refreshing={personalFeedsIsFetching} onRefresh={refetchPersonalFeeds} />}
        estimatedItemSize={100}
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
            onToggleLike={
              // postLikeToggleHandler
              LikeToggle
            }
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            onCommentToggle={commentsOpenHandler}
          />
        )}
      />

      {commentsOpen && (
        <FeedComment
          handleOpen={commentsOpenHandler}
          handleClose={commentsCloseHandler}
          postId={postId}
          onSubmit={commentSubmitHandler}
          total_comments={postTotalComment}
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
