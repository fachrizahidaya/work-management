import { useState, useCallback, memo } from "react";

import { Clipboard, Linking, StyleSheet, View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { ScrollView } from "react-native-gesture-handler";

import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";

const FeedComment = ({
  postId,
  loggedEmployeeName,
  loggedEmployeeImage,
  commentIsFetching,
  commentIsLoading,
  comments,
  handleClose,
  refetchComment,
  onEndReached,
  commentRefetchHandler,
  parentId,
  onSubmit,
  onReply,
  employeeUsername,
  employees,
  reference,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

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
    <ActionSheet ref={reference} onClose={handleClose}>
      <View style={styles.header}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>Comments</Text>
        </View>
      </View>
      <View
        style={{
          gap: 21,
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: 40,
        }}
      >
        <ScrollView>
          <FeedCommentList
            comments={comments}
            hasBeenScrolled={hasBeenScrolled}
            setHasBeenScrolled={setHasBeenScrolled}
            onReply={onReply}
            commentEndReachedHandler={onEndReached}
            commentsRefetchHandler={commentRefetchHandler}
            commentIsFetching={commentIsFetching}
            commentIsLoading={commentIsLoading}
            refetchComment={refetchComment}
            handleLinkPress={handleLinkPress}
            handleEmailPress={handleEmailPress}
            copyToClipboard={copyToClipboard}
            employeeUsername={employeeUsername}
          />
        </ScrollView>

        <FeedCommentForm
          postId={postId}
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          parentId={parentId}
          onSubmit={onSubmit}
          employees={employees}
        />
      </View>
    </ActionSheet>
  );
};

export default memo(FeedComment);

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
    marginTop: 15,
  },
});
