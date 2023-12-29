import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import RenderHtml from "react-native-render-html";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";

import ChatTimeStamp from "../../ChatTimeStamp/ChatTimeStamp";

const GlobalSearchChatList = ({ chat, searchKeyword, group }) => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("screen");
  const userSelector = useSelector((state) => state.auth);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderChat = () => {
    return boldMatchCharacters(chat?.message, searchKeyword);
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
          });
        } else {
          navigation.navigate("Chat Room", {
            name: chat.user.name,
            userId: chat.user.id,
            image: chat.user.image,
            type: "personal",
          });
        }
      }}
    >
      <View style={{ padding: 10, borderColor: "#E8E9EB", borderBottomWidth: 1 }}>
        {group ? (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{group.name}</Text>

              <ChatTimeStamp time={chat.created_time} timestamp={chat.created_at} />
            </View>
            <View style={{ gap: 5 }}>
              <Text>{userSelector.id === chat?.user?.id ? "You: " : `${chat?.user?.name}: `}</Text>

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
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>{chat?.user?.name}</Text>

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
