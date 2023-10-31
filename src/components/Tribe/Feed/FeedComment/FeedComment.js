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
  handleOpen,
  handleClose,
  postRefetchHandler,
  refetchFeeds,
  onSubmit,
}) => {
  const [comments, setComments] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);

  const inputRef = useRef();

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 50,
  };

  const {
    data: commentData,
    isFetching: commentDataIsFetching,
    refetch: refetchComment,
  } = useFetch(!fetchIsDone && `/hr/posts/${postId}/comment`, [currentOffset], commentsFetchParameters);

  /**
   * Fetch more Comments handler
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (!fetchIsDone) {
      if (comments.length !== comments.length + commentData?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  /**
   * Fetch from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

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
      onSubmit(postId);
      refetchComment();
      postRefetchHandler();
      refetchFeeds();
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
      // if (commentData?.data) {
      //   if (currentOffset === 0) {
      //     setComments(commentData?.data);
      //   } else {
      //     setComments((prevData) => [...prevData, ...commentData?.data]);
      //   }
      // }
    }
  }, [
    handleOpen,
    // commentData?.data
  ]);

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
                handleEndReached={commentEndReachedHandler}
                commentsRefetchHandler={commentRefetchHandler}
                commentIsFetching={commentDataIsFetching}
                refetchComment={refetchComment}
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
