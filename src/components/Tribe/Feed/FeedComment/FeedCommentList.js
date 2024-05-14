import { View, ActivityIndicator, Text } from "react-native";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import FeedCommentItem from "./FeedCommentItem";

const FeedCommentList = ({
  comments,
  onReply,
  handleWhenScrollReachedEnd,
  commentIsFetching,
  commentIsLoading,
  hasBeenScrolled,
  setHasBeenScrolled,
  onPressLink,
  employeeUsername,
  setCommentParentId,
  navigation,
  handleRefreshComments,
}) => {
  return (
    <GestureHandlerRootView>
      <View style={{ height: 320 }}>
        {comments.length > 0 ? (
          <FlashList
            data={comments}
            keyExtractor={(item, index) => item.id}
            onEndReachedThreshold={0.1}
            onScrollBeginDrag={() => setHasBeenScrolled(true)}
            ListFooterComponent={() => commentIsLoading && <ActivityIndicator />}
            onEndReached={hasBeenScrolled ? handleWhenScrollReachedEnd : null}
            estimatedItemSize={80}
            refreshControl={
              <RefreshControl
                refreshing={commentIsFetching}
                onRefresh={() => {
                  handleRefreshComments();
                }}
              />
            }
            renderItem={({ item, index }) => (
              <FeedCommentItem
                key={index}
                postId={item?.id}
                parentId={item.parent_id ? item?.parent_id : item?.id}
                authorImage={item?.employee_image}
                authorName={item?.employee_name}
                totalReplies={item?.total_replies}
                comments={item?.comments}
                onReply={onReply}
                onPressLink={onPressLink}
                employeeUsername={employeeUsername}
                setCommentParentId={setCommentParentId}
                navigation={navigation}
              />
            )}
          />
        ) : (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>No Comments Yet</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default FeedCommentList;
