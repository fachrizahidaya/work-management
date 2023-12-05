import { memo } from "react";

import { Box, Flex, Image, Spinner, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCardItem from "../FeedPersonal/FeedCardItem";
import { useSelector } from "react-redux";
import EmployeeContact from "../Employee/EmployeeContact";
import EmployeeProfile from "../Employee/EmployeeProfile";
import EmployeeSelfProfile from "../Employee/EmployeeSelfProfile";
import EmployeeTeammates from "../Employee/EmployeeTeammates";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../shared/ToastDialog";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  postEndReachedHandler,
  personalPostIsFetching,
  refetchPersonalPost,
  employee,
  toggleTeammates,
  teammates,
  teammatesIsOpen,
  hasBeenScrolled,
  setHasBeenScrolled,
  onCommentToggle,
  forceRerender,
  setForceRerender,
  personalPostIsLoading,
  toggleFullScreen,
}) => {
  const userSelector = useSelector((state) => state.auth);

  const toast = useToast();

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPersonalPost();
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

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleEmailPress = (email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const copyToClipboard = (text) => {
    try {
      if (typeof text !== String) {
        var textToCopy = text.toString();
        Clipboard.setString(textToCopy);
      } else {
        Clipboard.setString(text);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        ListFooterComponent={() => personalPostIsFetching && <Spinner size="sm" />}
        refreshControl={
          <RefreshControl
            refreshing={personalPostIsFetching}
            onRefresh={() => {
              refetchPersonalPost();
            }}
          />
        }
        // Employee Information
        ListHeaderComponent={
          <Box>
            <Image
              source={require("../../../assets/profile_banner.jpg")}
              alignSelf="center"
              h={100}
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
        // Employee Posts
        renderItem={({ item, index }) => {
          if (item.length === 0) {
            return (
              <Flex alignItems="center" justifyContent="center" py={3} px={3}>
                <Text fontSize={16} fontWeight={500}>
                  No Posts Yet
                </Text>
              </Flex>
            );
          }
          return (
            <>
              {personalPostIsFetching ? (
                <Spinner />
              ) : (
                <Box px={3}>
                  <FeedCardItem
                    key={index}
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
                    onCommentToggle={onCommentToggle}
                    refetchPersonalPost={refetchPersonalPost}
                    forceRerenderPersonal={forceRerender}
                    setForceRerenderPersonal={setForceRerender}
                    toggleFullScreen={toggleFullScreen}
                    handleLinkPress={handleLinkPress}
                    handleEmailPress={handleEmailPress}
                    copyToClipboard={copyToClipboard}
                  />
                </Box>
              )}
            </>
          );
        }}
      />
    </Box>
  );
};

export default memo(FeedCard);
