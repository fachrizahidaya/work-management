import { Avatar, Box, FlatList, Flex, Icon, Pressable, Slide, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFetch } from "../../../../hooks/useFetch";
import { useRef } from "react";
import axiosInstance from "../../../../config/api";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { card } from "../../../../styles/Card";
import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";

const FeedComment = ({
  handleOpen,
  handleClose,
  loggedEmployeeId,
  loggedEmployeeImage,
  postId,
  total_comments,
  onSubmit,
}) => {
  const [commentParentId, setCommentParentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const { width, height } = Dimensions.get("window");
  const inputRef = useRef();

  const fetchComment = async () => {
    try {
      const res = await axiosInstance.get(`/hr/posts/${postId}/comment`);
      setComments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const commentSubmitHandler = async (data) => {
    try {
      console.log("data", data);
      const res = await axiosInstance.post(`/hr/posts/comment`, data);
      fetchComment();
      setCommentParentId(null);
      onSubmit(postId);
    } catch (err) {
      console.log(err);
    }
  };

  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
    inputRef.current.focus();
  };

  useEffect(() => {
    if (!handleOpen) {
      setCommentParentId(null);
    } else {
      fetchComment();
    }
  }, [handleOpen]);

  return (
    <>
      <Slide in={handleOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Pressable onPress={handleClose}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
            </Pressable>
            <Text fontSize={16} fontWeight={500}>
              Comments
            </Text>
            <Text fontSize={16} fontWeight={400}>
              {total_comments}
            </Text>
          </Flex>
        </Flex>
        <Box w={width} h={height} p={1} style={styles.container}>
          <Flex gap={1} mt={1}>
            <Flex flexDir="column" style={card.card}>
              <FeedCommentList
                comments={comments}
                onReply={replyHandler}
                loggedEmployeeId={loggedEmployeeId}
                postId={postId}
                latestExpandedReply={latestExpandedReply}
              />
            </Flex>
            <FeedCommentForm
              postId={postId}
              loggedEmployeeImage={loggedEmployeeImage}
              parentId={commentParentId}
              inputRef={inputRef}
              onSubmit={commentSubmitHandler}
            />
          </Flex>
        </Box>
      </Slide>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default FeedComment;
