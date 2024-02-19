FeedCommentReplyItem
import { StyleSheet, View, Text, Pressable } from "react-native";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { TextProps } from "../../../shared/CustomStylings";

const FeedCommentReplyItem = ({
  authorName,
  comments,
  totalReplies,
  onReply,
  parentId,
  authorImage,
  handleLinkPress,
  handleEmailPress,
  copyToClipboard,
  employeeUsername,
}) => {
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
    <View style={{ marginHorizontal: 40, marginVertical: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View>
          <AvatarPlaceholder image={authorImage} name={authorName} size="md" isThumb={false} />
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ fontSize: 12, fontWeight: "500" }}>
            {authorName.length > 30 ? authorName.split(" ")[0] : authorName}
          </Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>{styledTexts}</Text>
          <Pressable
            onPress={() => {
              onReply(parentId);
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#8A7373" }}>Reply</Text>
          </Pressable>
        </View>
      </View>
      {totalReplies > 0 && (
        <>
          <View>
            <Text>{totalReplies}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default FeedCommentReplyItem;

const styles = StyleSheet.create({
  defaultText: {
    color: "black",
  },
  highlightedText: {
    color: "#72acdc",
  },
});