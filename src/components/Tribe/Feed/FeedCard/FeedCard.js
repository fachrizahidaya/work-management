import { memo } from "react";

import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import FeedCardItem from "./FeedCardItem";

const FeedCard = ({
  posts,
  loggedEmployeeId,
  loggedEmployeeImage,
  handleWhenScrollReachedEnd,
  hasBeenScrolled,
  setHasBeenScrolled,
  postIsFetching,
  postIsLoading,
  onCommentToggle,
  forceRerender,
  onToggleFullScreen,
  employeeUsername,
  navigation,
  onPressLink,
  onToggleLike,
  reference,
  setPostId,
  isFullScreen,
  setIsFullScreen,
  setSelectedPicture,
  onToggleReport,
  handleRefreshPosts,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        data={posts}
        extraData={forceRerender} // re-render data handler
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item?.id}
        refreshing={true}
        onScrollBeginDrag={() => {
          setHasBeenScrolled(true); // handle detect user has scrolled or not
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={hasBeenScrolled ? handleWhenScrollReachedEnd : null}
        refreshControl={
          <RefreshControl
            refreshing={postIsFetching}
            onRefresh={() => {
              handleRefreshPosts();
            }}
          />
        }
        ListFooterComponent={() => postIsLoading && <ActivityIndicator />}
        renderItem={({ item }) => (
          <FeedCardItem
            key={item?.id}
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
            onToggleFullScreen={onToggleFullScreen}
            onPressLink={onPressLink}
            employeeUsername={employeeUsername}
            navigation={navigation}
            reference={reference}
            setPostId={setPostId}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            setSelectedPicture={setSelectedPicture}
            onToggleReport={onToggleReport}
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
