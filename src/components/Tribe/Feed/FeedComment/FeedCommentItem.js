import { memo, useState } from "react";

import { StyleSheet, View, Text, Pressable,  } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useFetch } from "../../../../hooks/useFetch";
import { TextProps } from "../../../shared/CustomStylings";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FeedCommentReplyItem from "./FeedCommentReplyItem";

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
    <View style={{ gap: 3 }}>
      <Pressable onPress={() => onReply(null)} style={{ marginVertical: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View>
            <AvatarPlaceholder image={authorImage} name={authorName} size="md" isThumb={false} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: "500" }}>
              {authorName.length > 30 ? authorName.split(" ")[0] : authorName}
            </Text>
            <Text style={[{ fontSize: 12 }, TextProps]}>{styledTexts}</Text>

            <Text onPress={() => onReply(parentId)} style={{ fontSize: 12, fontWeight: "500", color: "#8A7373" }}>
              Reply
            </Text>
          </View>
        </View>

        {!totalReplies ? (
          ""
        ) : (
          <Pressable
            style={{
              marginHorizontal: 40,
              marginVertical: 10,
            }}
            onPress={() => {
              refetchCommentRepliesData();
              setHideReplies(false);
              setViewReplyToggle(true);
            }}
          >
            {viewReplyToggle === false ? (
              <Text style={{ fontSize: 12, fontWeight: "500", color: "#8A7373", marginLeft: 10 }}>
                View{totalReplies ? ` ${totalReplies}` : ""} {totalReplies > 1 ? "Replies" : "Reply"}
              </Text>
            ) : (
              ""
            )}
          </Pressable>
        )}

        {viewReplyToggle === true && totalReplies > 0 && hideReplies === false && (
          <>
            <View style={{ flex: 1, minHeight: 2 }}>
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
                    handleEmailPress={handleEmailPress}
                    handleLinkPress={handleLinkPress}
                    copyToClipboard={copyToClipboard}
                    employeeUsername={employeeUsername}
                  />
                )}
              />
            </View>

            {viewReplyToggle === false ? (
              ""
            ) : (
              <View style={{ marginHorizontal: 40, marginVertical: 5 }}>
                <Pressable
                  onPress={() => {
                    setViewReplyToggle(false);
                    setHideReplies(true);
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "500", color: "#8A7373" }}>Hide Reply</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </Pressable>
      
    </View>
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