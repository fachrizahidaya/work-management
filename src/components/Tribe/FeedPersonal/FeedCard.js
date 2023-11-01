import { useState } from "react";

import { Box, Flex, Image, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "../Feed/FeedCardItem";
import FeedComment from "../Feed/FeedComment/FeedComment";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";
import EmployeeContact from "../Employee/EmployeeContact";
import EmployeeProfile from "../Employee/EmployeeProfile";
import EmployeeSelfProfile from "../Employee/EmployeeSelfProfile";
import EmployeeTeammates from "../Employee/EmployeeTeammates";

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
  employee,
  toggleTeammates,
  teammates,
  teammatesIsOpen,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const [postId, setPostId] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const { height } = Dimensions.get("screen");

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
    refetchPersonalFeeds();
  };

  return (
    <Box flex={1}>
      <FlashList
        data={posts.length > 0 ? posts : [{ id: "no-posts" }]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        keyExtractor={(item, index) => index}
        onEndReached={posts.length ? handleEndReached : null}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl
            refreshing={personalFeedsIsFetching}
            onRefresh={() => {
              refetchPersonalFeeds();
              postRefetchHandler();
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
                onToggleLike={onToggleLike}
                loggedEmployeeId={loggedEmployeeId}
                loggedEmployeeImage={loggedEmployeeImage}
                onCommentToggle={commentsOpenHandler}
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