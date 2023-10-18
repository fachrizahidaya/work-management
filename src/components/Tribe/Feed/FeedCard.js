import { useState } from "react";

import { Box, Skeleton, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useDisclosure } from "../../../hooks/useDisclosure";

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
  feedsIsLoading,
}) => {
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(null);

  const { isOpen: commentIsOpen, toggle: toggleComment } = useDisclosure(false);

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
  };

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
        onEndReachedThreshold={0.1}
        onEndReached={posts.length ? handleEndReached : null}
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshControl={<RefreshControl refreshing={feedsIsFetching} onRefresh={refetchFeeds} />}
        renderItem={({ item }) => (
          <FeedCardItem
            key={item?.id}
            post={item}
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
            // like post
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            onToggleLike={onToggleLike}
            // toggle Comment
            onCommentToggle={commentsOpenHandler}
          />
        )}
      />
      {commentsOpen && (
        <FeedComment
          handleOpen={commentsOpen}
          handleClose={commentsCloseHandler}
          postId={postId}
          total_comments={postTotalComment}
          onSubmit={commentSubmitHandler}
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          postRefetchHandler={postRefetchHandler}
        />
      )}
    </Box>
  );
};

export default FeedCard;
