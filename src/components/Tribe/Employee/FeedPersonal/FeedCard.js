import { memo } from "react";

import {
  Linking,
  Clipboard,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { FlashList } from "@shopify/flash-list";

import axiosInstance from "../../../../config/api";
import FeedCardItem from "./FeedCardItem";
import EmployeeContact from "../EmployeeContact";
import EmployeeProfile from "../EmployeeProfile";
import EmployeeSelfProfile from "../EmployeeSelfProfile";
import { ErrorToastProps } from "../../../shared/CustomStylings";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  postEndReachedHandler,
  personalPostIsFetching,
  refetchPersonalPost,
  employee,
  teammates,
  hasBeenScrolled,
  setHasBeenScrolled,
  onCommentToggle,
  forceRerender,
  setForceRerender,
  personalPostIsLoading,
  toggleFullScreen,
  openSelectedPersonalPost,
  employeeUsername,
  userSelector,
  toggleDeleteModal,
  toggleEditModal,
  reference,
  navigation,
  postRefetchHandler,
}) => {
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
      Toast.show(err.response.data.message, ErrorToastProps);
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
    <View style={{ flex: 1 }}>
      <FlashList
        data={posts.length > 0 ? posts : [{ id: "no-posts" }]}
        extraData={forceRerender} // re-render data handler
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={150}
        onScrollBeginDrag={() => setHasBeenScrolled(true)} // user scroll handler
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        ListFooterComponent={() =>
          personalPostIsLoading && <ActivityIndicator />
        }
        refreshControl={
          <RefreshControl
            refreshing={personalPostIsFetching}
            onRefresh={() => {
              postRefetchHandler();
              refetchPersonalPost();
            }}
          />
        }
        // Employee Information
        ListHeaderComponent={
          <View>
            <Image
              source={require("../../../../assets/profile_banner.jpg")}
              style={styles.image}
              alt="empty"
            />
            {/* When the employee id is not equal, it will appear the contacts of employee */}
            <View style={styles.information}>
              {userSelector?.id !== employee?.data?.user_id ? (
                <>
                  <View style={styles.contact}>
                    <EmployeeContact employee={employee} />
                  </View>
                  <EmployeeProfile
                    employee={employee}
                    teammates={teammates}
                    reference={reference}
                  />
                </>
              ) : (
                <EmployeeSelfProfile
                  employee={employee}
                  teammates={teammates}
                  reference={reference}
                />
              )}
            </View>
          </View>
        }
        // Employee Posts
        renderItem={({ item, index }) => {
          if (item.id === "no-posts") {
            return (
              <View style={styles.noPost}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  No Posts Yet
                </Text>
              </View>
            );
          }
          return (
            <View style={{ paddingHorizontal: 14 }}>
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
                forceRerenderPersonal={forceRerender}
                setForceRerenderPersonal={setForceRerender}
                toggleFullScreen={toggleFullScreen}
                handleLinkPress={handleLinkPress}
                handleEmailPress={handleEmailPress}
                copyToClipboard={copyToClipboard}
                openSelectedPersonalPost={openSelectedPersonalPost}
                employeeUsername={employeeUsername}
                toggleDeleteModal={toggleDeleteModal}
                toggleEditModal={toggleEditModal}
                navigation={navigation}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default memo(FeedCard);

const styles = StyleSheet.create({
  container: {},
  information: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    position: "relative",
    paddingHorizontal: 10,
  },
  image: {
    height: 100,
    width: 500,
    resizeMode: "cover",
    alignSelf: "center",
  },
  noPost: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 10,
    paddingTop: 30,
  },
  contact: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingTop: 2,
    gap: 5,
  },
});
