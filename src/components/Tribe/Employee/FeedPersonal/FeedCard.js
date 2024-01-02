import { memo } from "react";

import { Linking, Clipboard, StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import axiosInstance from "../../../../config/api";
import FeedCardItem from "./FeedCardItem";
import EmployeeContact from "../EmployeeContact";
import EmployeeProfile from "../EmployeeProfile";
import EmployeeSelfProfile from "../EmployeeSelfProfile";
import EmployeeTeammates from "../EmployeeTeammates";

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
  openSelectedPersonalPost,
  employeeUsername,
  userSelector,
  reference,
}) => {
  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      // refetchPersonalPost();
      console.log("Process success");
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
    <View style={styles.container}>
      <FlatList
        data={posts.length > 0 ? posts : [{ id: "no-posts" }]}
        extraData={forceRerender} // re-render data handler
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        onScrollBeginDrag={() => setHasBeenScrolled(true)} // user scroll handler
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        ListFooterComponent={() => personalPostIsLoading && hasBeenScrolled && <ActivityIndicator />}
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
          <View>
            <Image source={require("../../../../assets/profile_banner.jpg")} style={styles.image} alt="empty" />
            {/* When the employee id is not equal, it will appear the contacts of employee */}
            <View style={styles.information}>
              {userSelector?.id !== employee?.data?.user_id ? (
                <>
                  <View style={styles.contact}>
                    <EmployeeContact employee={employee} />
                  </View>
                  <EmployeeProfile
                    employee={employee}
                    toggleTeammates={toggleTeammates}
                    teammates={teammates}
                    reference={reference}
                  />
                </>
              ) : (
                <EmployeeSelfProfile
                  employee={employee}
                  toggleTeammates={toggleTeammates}
                  teammates={teammates}
                  reference={reference}
                />
              )}

              <EmployeeTeammates teammatesIsOpen={teammatesIsOpen} teammates={teammates} reference={reference} />
            </View>
          </View>
        }
        // Employee Posts
        renderItem={({ item, index }) => {
          if (item.id === "no-posts") {
            return (
              <View style={styles.noPost}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>No Posts Yet</Text>
              </View>
            );
          }
          return (
            <View style={{ paddingHorizontal: 10 }}>
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
              />
            </View>
          );
        }}
      />
      <Toast />
    </View>
  );
};

export default memo(FeedCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  contact: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingTop: 2,
    gap: 5,
  },
});
