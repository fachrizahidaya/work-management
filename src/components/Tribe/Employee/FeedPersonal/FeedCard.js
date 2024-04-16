import { memo } from "react";

import { StyleSheet, View, Text, ActivityIndicator, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import FeedCardItem from "./FeedCardItem";
import EmployeeData from "../EmployeeData";

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
  onPressLink,
  onToggleLike,
  setPostId,
  commentScreenSheetRef,
  isFullScreen,
  setIsFullScreen,
  setSelectedPicture,
  refetchAllPost,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts.length > 0 ? posts : [{ id: "no-posts" }]}
        extraData={forceRerender} // re-render data handler
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={150}
        onScrollBeginDrag={() => setHasBeenScrolled(true)} // user scroll handler
        onEndReached={hasBeenScrolled === true ? postEndReachedHandler : null}
        ListFooterComponent={() => personalPostIsLoading && <ActivityIndicator />}
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
          <EmployeeData userSelector={userSelector} employee={employee} teammates={teammates} reference={reference} />
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
                onToggleLike={onToggleLike}
                loggedEmployeeId={loggedEmployeeId}
                loggedEmployeeImage={loggedEmployeeImage}
                onCommentToggle={onCommentToggle}
                forceRerenderPersonal={forceRerender}
                setForceRerenderPersonal={setForceRerender}
                toggleFullScreen={toggleFullScreen}
                handleLinkPress={onPressLink}
                openSelectedPersonalPost={openSelectedPersonalPost}
                employeeUsername={employeeUsername}
                toggleDeleteModal={toggleDeleteModal}
                toggleEditModal={toggleEditModal}
                navigation={navigation}
                reference={commentScreenSheetRef}
                setPostId={setPostId}
                refetchPost={refetchPersonalPost}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
                setSelectedPicture={setSelectedPicture}
                refetchAllPost={refetchAllPost}
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
  noPost: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 10,
    paddingTop: 30,
  },
});
