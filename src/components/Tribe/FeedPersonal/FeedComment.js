import { memo, useCallback, useState } from "react";

import { Flex, ScrollView, Text, Actionsheet } from "native-base";

import FeedCommentList from "../Feed/FeedComment/FeedCommentList";
import FeedCommentForm from "../Feed/FeedComment/FeedCommentForm";
import { useFetch } from "../../../hooks/useFetch";
import { Clipboard, Linking } from "react-native";

const FeedComment = ({
  postId,
  loggedEmployeeId,
  loggedEmployeeName,
  loggedEmployeeImage,
  commentIsFetching,
  commentIsLoading,
  comments,
  handleOpen,
  handleClose,
  refetchComment,
  onEndReached,
  commentRefetchHandler,
  parentId,
  onSubmit,
  onReply,
  latestExpandedReply,
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
        <Flex flexDir="column" justifyContent="center">
          <Flex
            flexDir="row"
            alignItems="center"
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor="#DBDBDB"
          >
            <Flex mb={2} alignItems="center">
              <Text fontSize={15} fontWeight={500}>
                Comments
              </Text>
            </Flex>
          </Flex>
          <ScrollView flex={1} style={{ maxHeight: 600 }}>
            <Flex gap={1} mt={1} flex={1}>
              <FeedCommentList
                comments={comments}
                latestExpandedReply={latestExpandedReply}
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
                commentIsLoading={commentIsLoading}
              />
            </Flex>
          </ScrollView>

          <FeedCommentForm
            postId={postId}
            loggedEmployeeImage={loggedEmployeeImage}
            loggedEmployeeName={loggedEmployeeName}
            parentId={parentId}
            onSubmit={onSubmit}
          />
        </Flex>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default memo(FeedComment);
