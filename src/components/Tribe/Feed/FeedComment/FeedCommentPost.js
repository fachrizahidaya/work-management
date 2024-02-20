import React, { useCallback, useState } from "react";

import { Clipboard, Linking, View } from "react-native";

import FeedCommentListPost from "./FeedCommentListPost";

const FeedCommentPost = ({
  commentIsLoading,
  comments,
  onEndReached,
  onReply,
  employeeUsername,
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
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          gap: 21,
          flexDirection: "column",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <FeedCommentListPost
          comments={comments}
          onReply={onReply}
          commentEndReachedHandler={onEndReached}
          commentIsLoading={commentIsLoading}
          employeeUsername={employeeUsername}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
          handleLinkPress={handleLinkPress}
          handleEmailPress={handleEmailPress}
          copyToClipboard={copyToClipboard}
        />
      </View>
    </>
  );
};

export default FeedCommentPost;
