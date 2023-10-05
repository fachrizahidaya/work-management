import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import Echo from "laravel-echo";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
  PusherAuthorizerResult,
} from "@pusher/pusher-websocket-react-native";
import { useSelector } from "react-redux";

import { FlatList, Flex } from "native-base";
import { SafeAreaView } from "react-native";

import ChatBubble from "../../components/Chat/ChatBubble/ChatBubble";
import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";

const ChatRoom = () => {
  const route = useRoute();
  const { name, userId, image } = route.params;
  const pusher = Pusher.getInstance();
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const [chatList, setChatList] = useState([]);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

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
      // setChatList(event.data);
      console.log(event.data);
    });
  };

  // const getPersonalChat = async () => {
  //   try {
  //     await pusher.init({
  //       apiKey: "kssapp",
  //       cluster: "mt1",
  //       authEndpoint: "api-dev.kolabora-app.com",
  //       onAuthorizer,
  //       onConnectionStateChange,
  //       onError,
  //       onEvent,
  //       onSubscriptionSucceeded,
  //       onSubscriptionError,
  //       onSubscriptionCount,
  //       onDecryptionFailure,
  //       onMemberAdded,
  //       onMemberRemoved,
  //     });

  //     await pusher.connect();
  //     await pusher.subscribe({
  //       channelName: `personal.chat.${userSelector.id}.${userId}`,
  //       onEvent: (event) => {
  //         console.log(event);
  //         // if (event.eventName === `.personal.chat`) {
  //         //   setChatList(event.data);
  //         // }
  //       },
  //     });
  //   } catch (e) {
  //     log("ERROR: " + e);
  //   }
  // };

  const getPersonalMessage = async () => {
    const res = await axiosInstance.get(`/chat/personal/${userSelector.id}/${userId}/message`, {
      params: {
        offset: 0,
      },
    });

    if (res) {
      setChatList(res.data.data);
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

      <Flex flex={1} bg="#FAFAFA" paddingX={2}>
        <FlatList
          inverted
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
