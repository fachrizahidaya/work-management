import { useEffect, useState, useRef } from "react";

import { Flex, ScrollView, Text, Actionsheet } from "native-base";

import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";
import axiosInstance from "../../../../config/api";
import { useFetch } from "../../../../hooks/useFetch";

const FeedComment = ({
  postId,
  loggedEmployeeId,
  loggedEmployeeName,
  loggedEmployeeImage,
  commentData,
  commentDataIsFetching,
  currentOffset,
  comments,
  setComments,
  handleOpen,
  handleClose,
  postRefetchHandler,
  commentAddHandler,
  refetchFeeds,
  refetchCommentData,
  commentEndReachedHandler,
  commentRefetchHandler,
}) => {
  const [commentParentId, setCommentParentId] = useState(null);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  const inputRef = useRef();

  /**
   * Submit a comment handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const commentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/comment`, data);
      setCommentParentId(null);
      commentAddHandler(postId);
      postRefetchHandler();
      commentRefetchHandler();
      refetchCommentData();
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
  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  };

  useEffect(() => {
    if (!handleOpen) {
      setCommentParentId(null);
    } else {
      if (commentData?.data && commentDataIsFetching === false) {
        if (currentOffset === 0) {
          setComments(commentData?.data);
        } else {
          setComments((prevData) => [...prevData, ...commentData?.data]);
        }
      }
    }
  }, [handleOpen, commentDataIsFetching]);

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
                comments={comments}
                onReply={replyHandler}
                loggedEmployeeId={loggedEmployeeId}
                postId={postId}
                latestExpandedReply={latestExpandedReply}
                commentEndReachedHandler={commentEndReachedHandler}
                commentsRefetchHandler={commentRefetchHandler}
                commentIsFetching={commentDataIsFetching}
                refetchComment={refetchCommentData}
                hasBeenScrolled={hasBeenScrolled}
                setHasBeenScrolled={setHasBeenScrolled}
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
            refetchFeeds={refetchFeeds}
          />
        </Flex>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default FeedComment;
