import { useState, useCallback, memo } from "react";

import { Clipboard, Linking, StyleSheet, View } from "react-native";
import { Flex, ScrollView, Text, Actionsheet } from "native-base";

import FeedCommentForm from "./FeedCommentForm";
import FeedCommentList from "./FeedCommentList";

const FeedComment = ({
  postId,
  loggedEmployeeName,
  loggedEmployeeImage,
  commentIsFetching,
  comments,
  handleOpen,
  handleClose,
  refetchComment,
  onEndReached,
  commentRefetchHandler,
  parentId,
  onSubmit,
  onReply,
  employeeUsername,
  employees,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

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
    <Actionsheet isOpen={handleOpen} onClose={handleClose}>
      <Actionsheet.Content>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={styles.header}>
            <Flex mb={2} alignItems="center">
              <Text fontSize={15} fontWeight={500}>
                Comments
              </Text>
            </Flex>
          </View>
          <ScrollView flex={1} style={{ maxHeight: 600 }}>
            <Flex gap={1} mt={1} flex={1}>
              <FeedCommentList
                comments={comments}
                hasBeenScrolled={hasBeenScrolled}
                setHasBeenScrolled={setHasBeenScrolled}
                onReply={onReply}
                commentEndReachedHandler={onEndReached}
                commentsRefetchHandler={commentRefetchHandler}
                commentIsFetching={commentIsFetching}
                refetchComment={refetchComment}
                handleLinkPress={handleLinkPress}
                handleEmailPress={handleEmailPress}
                copyToClipboard={copyToClipboard}
                employeeUsername={employeeUsername}
              />
            </Flex>
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
      </Actionsheet.Content>
    </Actionsheet>
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
  },
});
