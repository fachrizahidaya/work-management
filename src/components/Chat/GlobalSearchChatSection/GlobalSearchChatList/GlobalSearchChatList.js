import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import RenderHtml from "react-native-render-html";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";

import ChatTimeStamp from "../../ChatTimeStamp/ChatTimeStamp";
import { TextProps } from "../../../shared/CustomStylings";

const GlobalSearchChatList = ({ chat, message, searchKeyword, group, memberName }) => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("screen");
  const userSelector = useSelector((state) => state.auth);

  for (let i = 0; i < memberName?.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    message = message?.replace(placeholder, `@${memberName[i]}`);
  }

  var allWords = [];

  for (var i = 0; i < memberName?.length; i++) {
    var words = memberName[i].split(/\s+/);
    allWords = allWords.concat(words);
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
      if (allWords?.find((word) => item?.includes(word))) {
        return (
          <Text key={index} style={{ color: "white" }}>
            {item}{" "}
          </Text>
        );
      }
      return (
        <Text key={index} style={{ color: "white" }}>
          {item}{" "}
        </Text>
      );
    });
  }

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderChat = () => {
    return boldMatchCharacters(message, searchKeyword);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (chat.group) {
          navigation.navigate("Chat Room", {
            name: chat.group.name,
            userId: chat.group.id,
            image: chat.group.image,
            type: "group",
            forwardedMessage: null,
          });
        } else {
          navigation.navigate("Chat Room", {
            name: chat.user.name,
            userId: chat.user.id,
            image: chat.user.image,
            type: "personal",
            forwardedMessage: null,
          });
        }
      }}
    >
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderColor: "#E8E9EB",
          borderBottomWidth: 1,
        }}
      >
        {group ? (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600" }}>{group.name}</Text>

              <ChatTimeStamp time={chat.created_time} timestamp={chat.created_at} />
            </View>
            <View style={{ gap: 5 }}>
              <Text style={[{ fontSize: 12 }, TextProps]}>
                {userSelector.id === chat?.user?.id ? "You: " : `${chat?.user?.name}: `}
              </Text>

              <View style={{ flex: 1, marginTop: 5 }}>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: renderChat(),
                  }}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{chat?.user?.name}</Text>

                <ChatTimeStamp time={chat.created_time} timestamp={chat.created_at} />
              </View>
              <View style={{ flex: 1, marginTop: 5 }}>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: renderChat(),
                  }}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GlobalSearchChatList;
