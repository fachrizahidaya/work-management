import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";

import { useSelector } from "react-redux";

import { FlashList } from "@shopify/flash-list";
import { Flex } from "native-base";
import { SafeAreaView } from "react-native";

import ChatBubble from "../../components/Chat/ChatBubble/ChatBubble";
import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";

const ChatRoom = () => {
  window.Pusher = Pusher;
  const route = useRoute();
  const { name, userId, image } = route.params;
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();
  const [chatList, setChatList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const echo = new Echo({
    broadcaster: "pusher",
    key: "kssapp",
    wsHost: "api-dev.kolabora-app.com",
    wsPort: 6001,
    wssport: 6001,
    transports: ["websocket"],
    enabledTransports: ["ws", "wss"],
    forceTLS: false,
    disableStats: true,
    cluster: "mt1",
  });

  // PERSONAL CHAT
  const getPersonalChat = () => {
    echo.channel(`personal.chat.${userSelector.id}.${userId}`).listen(".personal.chat", (event) => {
      setChatList((currentChats) => [...currentChats, event.data]);
    });
  };

  const getPersonalMessage = async () => {
    try {
      if (hasMore) {
        const res = await axiosInstance.get(`/chat/personal/${userSelector.id}/${userId}/message`, {
          params: {
            offset: offset,
            limit: 20,
          },
        });
        setChatList((currentChats) => [...res.data.data, ...currentChats]);
        // setChatList((currentChats) => {
        //   if (currentChats.length !== currentChats.length + res.data.data.length) {
        //     return [...res.data.data, ...currentChats];
        //   } else {
        //     setHasMore(false);
        //     return currentChats;
        //   }
        // });
        // setOffset((prevState) => prevState + 20);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getPersonalMessage();
    }
    getPersonalChat();
  }, [userId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA", marginBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
      <ChatHeader name={name} navigation={navigation} />

      <Flex
        flex={1}
        bg="#FAFAFA"
        paddingX={2}
        // style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <FlashList
          inverted
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          // onEndReached={getPersonalMessage}
          estimatedItemSize={200}
          data={chatList}
          renderItem={({ item }) => (
            <ChatBubble
              chat={item}
              image={image}
              name={name}
              fromUserId={item.from_user_id}
              id={item.id}
              content={item.message}
              time={item.created_time}
            />
          )}
        />
      </Flex>

      <ChatInput userId={userId} />
    </SafeAreaView>
  );
};

export default ChatRoom;
