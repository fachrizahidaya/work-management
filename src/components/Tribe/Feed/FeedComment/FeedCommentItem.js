import { memo, useState } from "react";

import { StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Box, Flex, Pressable, Text } from "native-base";

import FeedCommentReplyItem from "./FeedCommentReplyItem";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useFetch } from "../../../../hooks/useFetch";

const FeedCommentItem = ({
  postId,
  parentId,
  authorImage,
  authorName,
  totalReplies,
  onReply,
  comments,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  employeeUsername,
}) => {
  const [viewReplyToggle, setViewReplyToggle] = useState(false);
  const [hideReplies, setHideReplies] = useState(false);

  const {
    data: commentRepliesData,
    isFetching: commentRepliesDataIsFetching,
    refetch: refetchCommentRepliesData,
  } = useFetch(parentId && `/hr/posts/${postId}/comment/${parentId}/replies`);

  const words = comments.split(" ");
  const styledTexts = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    let specificEmployee;
    specificEmployee = employeeUsername?.find((employee) => item?.includes(employee.username));
    const hasTag = item.includes("<a");
    const hasHref = item.includes("href");
    if (item.includes("https")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
          {item}{" "}
        </Text>
      );
    } else if (hasHref && specificEmployee) {
      const specificEmployeeId = specificEmployee.id;
      item = specificEmployee.username;
      textStyle = styles.highlightedText;
      return (
        <Text
          key={index}
          style={textStyle}
          onPress={() =>
            navigation.navigate("Employee Profile", {
              employeeId: specificEmployeeId,
              loggedEmployeeId: loggedEmployeeId,
              loggedEmployeeImage: loggedEmployeeImage,
            })
          }
        >
          @{item}{" "}
        </Text>
      );
    } else if (hasTag) {
      item = item.replace(`<a`, "");
      textStyle = styles.defaultText;
      return <Text key={index}>{item}</Text>;
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
          <Pressable
            mx={10}
            my={3}
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
        )}

        {viewReplyToggle === true && totalReplies > 0 && hideReplies === false && (
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
