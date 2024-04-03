import { StyleSheet, View } from "react-native";

import FeedCommentListPost from "./FeedCommentListPost";

const FeedCommentPost = ({
  commentIsLoading,
  comments,
  onEndReached,
  onReply,
  employeeUsername,
  linkPressHandler,
  setCommentParentId,
  navigation,
  hasBeenScrolled,
  setHasBeenScrolled,
  viewReplyToggle,
  setViewReplyToggle,
  hideReplies,
  setHideReplies,
}) => {
  return (
    <View style={styles.container}>
      <FeedCommentListPost
        comments={comments}
        onReply={onReply}
        commentEndReachedHandler={onEndReached}
        commentIsLoading={commentIsLoading}
        employeeUsername={employeeUsername}
        hasBeenScrolled={hasBeenScrolled}
        setHasBeenScrolled={setHasBeenScrolled}
        handleLinkPress={linkPressHandler}
        setCommentParentId={setCommentParentId}
        navigation={navigation}
        hideReplies={hideReplies}
        setHideReplies={setHideReplies}
        viewReplyToggle={viewReplyToggle}
        setViewReplyToggle={setViewReplyToggle}
      />
    </View>
  );
};

export default FeedCommentPost;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    gap: 21,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 14,
    elevation: 1,
  },
});
