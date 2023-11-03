import { useState } from "react";

import { Box, Flex, Image, Spinner, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "../FeedPersonal/FeedCardItem";
import FeedComment from "../Feed/FeedComment/FeedComment";
import { useSelector } from "react-redux";
import EmployeeContact from "../Employee/EmployeeContact";
import EmployeeProfile from "../Employee/EmployeeProfile";
import EmployeeSelfProfile from "../Employee/EmployeeSelfProfile";
import EmployeeTeammates from "../Employee/EmployeeTeammates";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../shared/ToastDialog";
import { useEffect } from "react";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  postRefetchHandler,
  postEndReachedHandler,
  personalFeedsIsFetching,
  personalFeedsIsLoading,
  refetchPersonalFeeds,
  refetchFeeds,
  employee,
  toggleTeammates,
  teammates,
  teammatesIsOpen,
  hasBeenScrolled,
  setHasBeenScrolled,
  reload,
  setReload,
}) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  const toast = useToast();

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffset,
    limit: 50,
  };

  const {
    data: commentData,
    isFetching: commentDataIsFetching,
    refetch: refetchCommentData,
  } = useFetch(`/hr/posts/${postId}/comment`, [reload, currentOffset], commentsFetchParameters);

  /**
   * Fetch more Comments handler
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + commentData?.data.length) {
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
  const commentAddHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
    refetchPersonalFeeds();
    setForceRerender(true);
  };

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPersonalFeeds();
      refetchFeeds();
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

  useEffect(() => {
    setForceRerender(!forceRerender);
  }, []);

  return (
    <Box flex={1}>
      <FlashList
        data={posts.length > 0 ? posts : [{ id: "no-posts" }]}
        extraData={forceRerender} // re-render data handler
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        onScrollBeginDrag={() => setHasBeenScrolled(true)} // user scroll handler
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        refreshControl={
          <RefreshControl
            refreshing={personalFeedsIsFetching}
            onRefresh={() => {
              refetchPersonalFeeds();
            }}
          />
        }
        // Employee Posts
        renderItem={({ item }) => {
          if (item.id === "no-posts") {
            return (
              <Flex alignItems="center" justifyContent="center" py={3} px={3}>
                <Text fontSize={16} fontWeight={500}>
                  No Posts Yet
                </Text>
              </Flex>
            );
          }
          return (
            <Box px={3}>
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
                onToggleLike={postLikeToggleHandler}
                loggedEmployeeId={loggedEmployeeId}
                loggedEmployeeImage={loggedEmployeeImage}
                onCommentToggle={commentsOpenHandler}
                refetch={refetchPersonalFeeds}
                forceRerender={forceRerender}
                setForceRerender={setForceRerender}
              />
            </Box>
          );
        }}
        // Employee Information
        ListHeaderComponent={
          <Box>
            <Image
              source={require("../../../assets/profile_banner.jpg")}
              alignSelf="center"
              h={200}
              w={500}
              alt="empty"
              resizeMode="cover"
            />
            {/* When the employee id is not equal, it will appear the contacts of employee */}
            <Flex px={3} position="relative" flexDir="column" bgColor="#FFFFFF">
              {userSelector?.id !== employee?.data?.user_id ? (
                <>
                  <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
                    <EmployeeContact employee={employee} />
                  </Flex>
                  <EmployeeProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
                </>
              ) : (
                <EmployeeSelfProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
              )}

              <EmployeeTeammates
                teammatesIsOpen={teammatesIsOpen}
                toggleTeammates={toggleTeammates}
                teammates={teammates}
              />
            </Flex>
          </Box>
        }
      />

      {commentsOpen && (
        <FeedComment
          handleOpen={commentsOpenHandler}
          handleClose={commentsCloseHandler}
          postId={postId}
          commentAddHandler={commentAddHandler}
          total_comments={postTotalComment}
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          postRefetchHandler={postRefetchHandler}
          refetchFeeds={refetchFeeds}
          commentRefetchHandler={commentRefetchHandler}
          currentOffset={currentOffset}
          setCurrentOffset={setCurrentOffset}
          commentData={commentData}
          commentDataIsFetching={commentDataIsFetching}
          refetchCommentData={refetchCommentData}
          commentEndReachedHandler={commentEndReachedHandler}
          comments={comments}
          setComments={setComments}
        />
      )}
    </Box>
  );
};

export default FeedCard;
