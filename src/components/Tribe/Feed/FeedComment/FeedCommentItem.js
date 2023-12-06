import { memo } from "react";

import { StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Box, Flex, Pressable, Text } from "native-base";

import FeedCommentReplyItem from "./FeedCommentReplyItem";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const FeedCommentItem = ({
  parentId,
  authorImage,
  authorName,
  totalReplies,
  onReply,
  comments,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  commentRepliesData,
  refetchCommentRepliesData,
  viewReplyToggle,
  setViewReplyToggle,
  hideReplies,
  setHideReplies,
}) => {
  const words = comments.split(" ");
  const styledTexts = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    if (item.includes("https")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
          {item}{" "}
        </Text>
      );
    } else if (item.includes("08") || item.includes("62")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => copyToClipboard(item)}>
          {item}{" "}
        </Text>
      );
    } else if (item.includes("@") && item.includes(".com")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleEmailPress(item)}>
          {item}{" "}
        </Text>
      );
    } else {
      textStyle = styles.defaultText;
      return (
        <Text key={index} style={textStyle}>
          {item}{" "}
        </Text>
      );
    }
  });

  return (
    <Flex gap={3}>
      <Flex my={1} minHeight={1}>
        <Flex direction="row" gap={2}>
          <Flex>
            <AvatarPlaceholder image={authorImage} name={authorName} size="sm" isThumb={false} />
          </Flex>
          <Flex flex={1} gap={1}>
            <Text fontSize={12} fontWeight={500}>
              {authorName.length > 30 ? authorName.split(" ")[0] : authorName}
            </Text>
            <Text fontSize={13} fontWeight={400}>
              {styledTexts}
            </Text>
            <Pressable onPress={() => onReply(parentId)}>
              <Text fontSize={12} fontWeight={500} color="#8A7373">
                Reply
              </Text>
            </Pressable>
          </Flex>
        </Flex>

        {!totalReplies ? (
          ""
        ) : (
          <Box mx={10} my={3}>
            <Pressable
              onPress={() => {
                refetchCommentRepliesData();
                setHideReplies(false);
                setViewReplyToggle(true);
              }}
            >
              {viewReplyToggle === false ? (
                <Text fontSize={12} fontWeight={500} color="#8A7373">
                  View{totalReplies ? ` ${totalReplies}` : ""} {totalReplies > 1 ? "Replies" : "Reply"}
                </Text>
              ) : (
                ""
              )}
            </Pressable>
          </Box>
        )}

        {viewReplyToggle && totalReplies > 0 && !hideReplies && (
          <>
            <Box flex={1} minHeight={2}>
              <FlashList
                data={commentRepliesData?.data}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={5}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                estimatedItemSize={200}
                renderItem={({ item, index }) => (
                  <FeedCommentReplyItem
                    key={index}
                    authorName={item?.employee_name}
                    authorImage={item?.employee_image}
                    comments={item?.comments}
                    totalReplies={item?.total_replies}
                    parentId={parentId}
                    onReply={onReply}
                  />
                )}
              />
            </Box>

            {viewReplyToggle === false ? (
              ""
            ) : (
              <Box mx={20} my={3}>
                <Pressable
                  onPress={() => {
                    setViewReplyToggle(false);
                    setHideReplies(true);
                  }}
                >
                  <Text fontSize={12} fontWeight={500} color="#8A7373">
                    Hide Reply
                  </Text>
                </Pressable>
              </Box>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(FeedCommentItem);

const styles = StyleSheet.create({
  defaultText: {
    color: "black",
  },
  highlightedText: {
    color: "#72acdc",
  },
});
