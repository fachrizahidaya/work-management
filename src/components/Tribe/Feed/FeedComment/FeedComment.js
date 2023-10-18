import { useEffect, useState, useRef } from "react";

import { Flex, ScrollView, Text, Actionsheet, KeyboardAvoidingView } from "native-base";

import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";
import axiosInstance from "../../../../config/api";
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
  postRefetchHandler,
}) => {
  const [comments, setComments] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);

  const inputRef = useRef();

  /**
   *
   * Fetch Comment Handler
   */
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 30,
  };

  const {
    data: commentData,
    isLoading: commentIsLoading,
    isFetching: commentIsFetching,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [currentOffset], commentsFetchParameters);

  const fetchComment = async (offset = 0, limit = 10, fetchMore = false) => {
    try {
      setComments(commentData?.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Submit comment handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */

  const commentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/comment`, data);
      setCommentParentId(null);
      onSubmit(postId);
      postRefetchHandler();
      refetchComment();
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * Control for reply a comment
   */
  const [commentParentId, setCommentParentId] = useState(null);
  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  };

  useEffect(() => {
    if (!handleOpen) {
      setCommentParentId(null);
    } else {
      refetchComment();
    }
  }, [handleOpen]);

  return (
    <Actionsheet isOpen={handleOpen} onClose={handleClose}>
      <Actionsheet.Content>
        <Flex flexDir="column" justifyContent="center">
          <Flex
            flexDir="row"
            alignItems="center"
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor="#DBDBDB"
          >
            <Flex mb={2} alignItems="center">
              <Text fontSize={15} fontWeight={500}>
                Comments
              </Text>
            </Flex>
          </Flex>
          <ScrollView flex={1} style={{ maxHeight: 600 }}>
            <Flex gap={1} mt={1} flex={1}>
              <FeedCommentList
                comments={commentData?.data}
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
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default FeedComment;
