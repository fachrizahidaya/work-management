import { memo, useCallback } from "react";

import { Clipboard, Linking } from "react-native";
import { Box, Spinner, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../shared/ToastDialog";
import FeedCardItem from "./FeedCardItem";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  postRefetchHandler,
  postEndReachedHandler,
  hasBeenScrolled,
  setHasBeenScrolled,
  postIsFetching,
  postIsLoading,
  refetchPost,
  scrollNewMessage,
  flashListRef,
  onCommentToggle,
  forceRerender,
  setForceRerender,
  toggleFullScreen,
  employeeUsername,
}) => {
  const toast = useToast();

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPost();
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

  const handleLinkPress = useCallback((url) => {
    Linking.openURL(url);
  }, []);

  const handleEmailPress = useCallback((email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

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
        removeClippedSubviews={true}
        ref={scrollNewMessage ? flashListRef : null}
        data={posts}
        extraData={forceRerender} // re-render data handler
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={20}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        estimatedItemSize={200}
        refreshing={true}
        onScrollBeginDrag={() => {
          setHasBeenScrolled(true); // user has scrolled handler
        }}
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        refreshControl={
          <RefreshControl
            refreshing={postIsFetching}
            onRefresh={() => {
              postRefetchHandler();
              refetchPost();
            }}
          />
        }
        ListFooterComponent={() => postIsLoading && hasBeenScrolled && <Spinner color="primary.600" size="lg" />}
        renderItem={({ item, index }) => (
          <FeedCardItem
            key={index}
            id={item?.id}
            employeeId={item?.author_id}
            employeeName={item?.employee_name}
            employeeImage={item?.employee_image}
            createdAt={item?.created_at}
            content={item?.content}
            total_like={item?.total_like}
            totalComment={item?.total_comment}
            likedBy={item?.liked_by}
            attachment={item?.file_path}
            type={item?.type}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            onToggleLike={postLikeToggleHandler}
            onCommentToggle={onCommentToggle}
            forceRerender={forceRerender}
            setForceRerender={setForceRerender}
            toggleFullScreen={toggleFullScreen}
            handleLinkPress={handleLinkPress}
            handleEmailPress={handleEmailPress}
            copyToClipboard={copyToClipboard}
            postRefetchHandler={postRefetchHandler}
            employeeUsername={employeeUsername}
          />
        )}
      />
    </Box>
  );
};

export default memo(FeedCard);
