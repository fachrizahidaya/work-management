import { memo } from "react";

import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

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
  onCommentToggle,
  forceRerender,
  toggleFullScreen,
  employeeUsername,
  navigation,
  onPressLink,
  onToggleLike,
  reference,
  setPostId,
  isFullScreen,
  setIsFullScreen,
  setSelectedPicture,
  setPosts,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
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
              setPosts([]);
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
            onToggleLike={onToggleLike}
            onCommentToggle={onCommentToggle}
            toggleFullScreen={toggleFullScreen}
            handleLinkPress={onPressLink}
            employeeUsername={employeeUsername}
            navigation={navigation}
            reference={reference}
            setPostId={setPostId}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            setSelectedPicture={setSelectedPicture}
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
