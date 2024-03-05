import { memo, useCallback } from "react";

import { Clipboard, Linking, StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import Toast from "react-native-root-toast";
import { RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import axiosInstance from "../../../../config/api";
import FeedCardItem from "./FeedCardItem";
import { ErrorToastProps, SuccessToastProps } from "../../../shared/CustomStylings";

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
  onCommentToggle,
  forceRerender,
  setForceRerender,
  toggleFullScreen,
  employeeUsername,
  navigation,
}) => {
  /**
   * Handle like a Post
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPost();
      console.log("Process success");
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle press link
   */
  const linkPressHandler = useCallback((url) => {
    try {
      Linking.openURL(url);
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  }, []);

  /**
   * Handle press email
   */
  const emailPressHandler = useCallback((email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

  /**
   * Handle copy to clipboard
   * @param {*} text
   */
  const copyToClipboardHandler = (text) => {
    try {
      if (typeof text !== String) {
        var textToCopy = text.toString();
        Clipboard.setString(textToCopy);
      } else {
        Clipboard.setString(text);
      }
      Toast.show("Copy to clipboard", SuccessToastProps);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        removeClippedSubviews={true}
        data={posts}
        extraData={forceRerender} // re-render data handler
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        estimatedItemSize={150}
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
        ListFooterComponent={() => postIsLoading && <ActivityIndicator />}
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
            handleLinkPress={linkPressHandler}
            handleEmailPress={emailPressHandler}
            copyToClipboard={copyToClipboardHandler}
            employeeUsername={employeeUsername}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

export default memo(FeedCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    flex: 1,
  },
});
