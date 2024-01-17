import { useEffect, useState } from "react";

import { View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";

const ChatMessageText = ({ message, myMessage, keyword = "", type, memberName, allWord }) => {
  const [mimeTypeInfo, setMimeTypeInfo] = useState(null);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong class='text-primary'>$&</strong>`);
  };

  const renderDangerouslyInnerHTMLContent = (message = "", alt_message = "") => {
    for (let i = 0; i < memberName.length; i++) {
      let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
      message = message?.replace(placeholder, `@${memberName[i]}`);
    }
    let styledTexts = null;
    if (message?.length !== 0) {
      let words;

      if (typeof message === "number" || typeof message === "bigint") {
        words = message.toString().split(" ");
      } else {
        words = message?.split(" ");
      }

      styledTexts = words?.map((item, index) => {
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
            <Text key={index} style={textStyle} onPress={() => CopyToClipboard(item)}>
              {item}{" "}
            </Text>
          );
        } else if (type === "group" && allWord.some((word) => item.includes(word))) {
          textStyle = styles.coloredText;
          return (
            <Text key={index} style={textStyle}>
              {item}{" "}
            </Text>
          );
        } else if (item.includes("@gmail.com")) {
          textStyle = styles.highlightedText;
          return (
            <Text key={index} style={textStyle} onPress={() => handleEmailPress(item)}>
              {item}{" "}
            </Text>
          );
        }
        return (
          <Text key={index} style={textStyle}>
            {item}{" "}
          </Text>
        );
      });
    }
    if (message) {
      if (keyword) {
        return boldMatchCharacters(message, keyword);
      }
      return message;
    }
    return alt_message;
  };

  const renderMessage = (attachment_type) => {
    if (attachment_type === "image") {
      return (
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>
            <MaterialCommunityIcons
              name="image"
              color={!myMessage ? "#3F434A" : type === "group" && !myMessage ? "#3F434A" : "#FFFFFF"}
            />

            {renderDangerouslyInnerHTMLContent(message?.message, "Image")}
          </Text>
        </View>
      );
    } else if (attachment_type === "document") {
      return (
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>
            <MaterialCommunityIcons
              name="file-outline"
              color={!myMessage ? "#3F434A" : type === "group" && !myMessage ? "#3F434A" : "#FFFFFF"}
            />

            {renderDangerouslyInnerHTMLContent(message?.message, message?.file_name)}
          </Text>
        </View>
      );
    } else {
      if (message?.project_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                color={!myMessage ? "#3F434A" : type === "group" && !myMessage ? "#3F434A" : "#FFFFFF"}
              />

              {renderDangerouslyInnerHTMLContent(message?.message, message?.project_title)}
            </Text>
          </View>
        );
      } else if (message?.task_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                color={!myMessage ? "#3F434A" : type === "group" && !myMessage ? "#3F434A" : "#FFFFFF"}
              />

              {renderDangerouslyInnerHTMLContent(message?.message, message?.task_title)}
            </Text>
          </View>
        );
      } else {
        return (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: !myMessage ? "#3F434A" : type === "group" && !myMessage ? "#3F434A" : "#FFFFFF",
            }}
          >
            {renderDangerouslyInnerHTMLContent(message?.message)}
          </Text>
        );
      }
    }
  };

  useEffect(() => {
    if (message) {
      setMimeTypeInfo(MimeTypeInfo(message.mime_type));
    }
  }, [message]);

  return (
    <>
      {message?.delete_for_everyone ? (
        <Text
          style={{ fontSize: 12, fontWeight: "400", fontStyle: "italic", color: !myMessage ? "#3F434A" : "#FFFFFF" }}
        >
          Message has been deleted
        </Text>
      ) : (
        renderMessage(mimeTypeInfo?.file_type)
      )}
    </>
  );
};

export default ChatMessageText;

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
  coloredText: {
    color: "#72acdc",
  },
});
