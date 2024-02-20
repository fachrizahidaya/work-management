import React from "react";

import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import FeedCommentItem from "./FeedCommentItem";

const FeedCommentListPost = ({
  comments,
  onReply,
  commentEndReachedHandler,
  commentIsLoading,
  hasBeenScrolled,
  setHasBeenScrolled,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  employeeUsername,
}) => {
  return (
    <View style={{}}>
      <FlashList
        data={comments}
        keyExtractor={(item, index) => item.id}
        onEndReachedThreshold={0.1}
        onScrollBeginDrag={() => setHasBeenScrolled(true)}
        ListFooterComponent={() => (commentIsLoading ? <ActivityIndicator /> : null)}
        onEndReached={hasBeenScrolled ? commentEndReachedHandler : null}
        estimatedItemSize={80}
        renderItem={({ item, index }) => {
          if (comments.length === 0) {
            return (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>No Comments Yet</Text>
              </View>
            );
          }
          return (
            <FeedCommentItem
              key={index}
              postId={item?.id}
              parentId={item.parent_id ? item?.parent_id : item?.id}
              authorImage={item?.employee_image}
              authorName={item?.employee_name}
              totalReplies={item?.total_replies}
              comments={item?.comments}
              onReply={onReply}
              handleLinkPress={handleLinkPress}
              handleEmailPress={handleEmailPress}
              copyToClipboard={copyToClipboard}
              employeeUsername={employeeUsername}
            />
          );
        }}
      />
    </View>
  );
};

export default FeedCommentListPost;
