import { Flex, Icon, Pressable, ScrollView, Slide, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { useRef } from "react";
import axiosInstance from "../../../../config/api";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";
import { useFetch } from "../../../../hooks/useFetch";

const FeedComment = ({
  handleOpen,
  handleClose,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  postId,
  total_comments,
  onSubmit,
}) => {
  const { data: comment, isLoading: commentIsLoading } = useFetch(`/hr/posts/${postId}/comment`);
  const [commentParentId, setCommentParentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const { width, height } = Dimensions.get("window");
  const inputRef = useRef();

  const fetchComment = async (offset = 0, limit = 10, fetchMore = false) => {
    try {
      const res = await axiosInstance.get(`/hr/posts/${postId}/comment`, {
        params: {
          offset: offset,
          limit: limit,
        },
      });
      setComments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const commentSubmitHandler = async (data) => {
    try {
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
    <Slide in={handleOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Flex flexDir="column" flexGrow={1} bgColor="white" position="relative">
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
        <ScrollView flex={1} style={{ maxHeight: 600 }}>
          <Flex gap={1} mt={1} flex={2} paddingX={5}>
            <FeedCommentList
              comments={comments}
              onReply={replyHandler}
              loggedEmployeeId={loggedEmployeeId}
              postId={postId}
              latestExpandedReply={latestExpandedReply}
              commentIsLoading={commentIsLoading}
            />
          </Flex>
        </ScrollView>
        <FeedCommentForm
          postId={postId}
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          parentId={commentParentId}
          inputRef={inputRef}
          onSubmit={commentSubmitHandler}
        />
      </Flex>
    </Slide>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default FeedComment;
