import React, { useState } from "react";

import { View } from "react-native";

import FeedCommentListPost from "./FeedCommentListPost";

const FeedCommentPost = ({
  commentIsLoading,
  comments,
  onEndReached,
  onReply,
  employeeUsername,
  linkPressHandler,
  emailPressHandler,
  copyToClipboardHandler,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  return (
    <>
      <View
        style={{
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
          handleLinkPress={linkPressHandler}
          handleEmailPress={emailPressHandler}
          copyToClipboard={copyToClipboardHandler}
        />
      </View>
    </>
  );
};

export default FeedCommentPost;
