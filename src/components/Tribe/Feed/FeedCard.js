import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { useDisclosure } from "../../../hooks/useDisclosure";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  onToggleLike,
  refetch,
  handleEndReached,
}) => {
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [editedPost, setEditedPost] = useState(null);
  const [postIsFetching, setPostIsFetching] = useState(false);
  const [postId, setPostId] = useState(null);

  console.log(posts);

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
    <>
      <Box height={600}>
        <FlashList
          data={posts}
          onEndReachedThreshold={0.1}
          onEndReached={posts.length ? handleEndReached : null}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item }) => (
            <FeedCardItem
              key={item?.id}
              post={item}
              id={item?.id}
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
              onCommentToggle={commentsOpenHandler}
            />
          )}
        />
      </Box>
      <FeedComment
        handleOpen={commentsOpen}
        handleClose={commentsCloseHandler}
        postId={postId}
        total_comments={postTotalComment}
        onSubmit={commentSubmitHandler}
        loggedEmployeeImage={loggedEmployeeImage}
        loggedEmployeeName={loggedEmployeeName}
        refetch={refetch}
      />
    </>
  );
};

export default FeedCard;
