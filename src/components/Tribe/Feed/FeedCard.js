import { Box, ScrollView, Skeleton } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";
import { ActivityIndicator, View } from "react-native";
import { useDisclosure } from "../../../hooks/useDisclosure";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  onToggleLike,
  postFetchDone,
  refetch,
  feedIsLoading,
  handleEndReached,
  setPosts,
}) => {
  const { isOpen: commentIsOpen, open: openComment, close: closeComment, toggle: toggleComment } = useDisclosure();
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [editedPost, setEditedPost] = useState(null);
  const [postIsFetching, setPostIsFetching] = useState(false);
  const [postId, setPostId] = useState(null);

  const commentsOpenHandler = (post_id) => {
    setPostId(post_id);
    setCommentsOpen(true);
    const togglePostComment = posts.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  const commentsCloseHandler = () => {
    setCommentsOpen(false);
    setPostId(null);
    // If return to feed screen, it will refetch Post
  };

  const commentSubmitHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
  };

  // useEffect(() => {
  //   if (!postFetchDone && postIsFetching && posts) {
  //     fetchPost(posts.length, 10, true).then(() => {
  //       setPostIsFetching(false);
  //     });
  //   } else {
  //     setPostIsFetching(false);
  //   }
  // }, [posts, postIsFetching, postFetchDone]);

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
              employee_name={item?.employee_name}
              created_at={item?.created_at}
              employee_image={item?.employee_image}
              content={item?.content}
              total_like={item?.total_like}
              total_comment={item?.total_comment}
              liked_by={item?.liked_by}
              attachment={item?.file_path}
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
        setPosts={setPosts}
      />
    </>
  );
};

export default FeedCard;
