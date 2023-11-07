import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import Pusher from "pusher-js/react-native";

import { useSelector } from "react-redux";

import { FlashList } from "@shopify/flash-list";
import { Flex } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import ChatBubble from "../../components/Chat/ChatBubble/ChatBubble";
import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import ChatSearch from "./ChatSearch";

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
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  /**
   * Event listener for new personal chat messages
   */
  const getPersonalChat = () => {
    laravelEcho.channel(`personal.chat.${userSelector.id}.${userId}`).listen(".personal.chat", (event) => {
      setChatList((currentChats) => [...currentChats, event.data]);
    });
  };

  /**
   * Event listener for new group chat messages
   */
  // const groupChatMessageEvent = () => {
  //   laravelEcho.channel(`group.chat.${userId}`).listen(".group.chat", (event) => {
  //     setChatMessages((prevState) => [...prevState, event.data]);
  //     scrollToBottom();
  //   });
  // };

  /**
   * Fetch personal chat messages
   */
  const getPersonalMessage = async () => {
    try {
      if (hasMore) {
        const res = await axiosInstance.get(`/chat/personal/${userId}/message`, {
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

  /**
   * Fetch group chat messages
   */
  const fetchGroupChatMessages = async () => {
    if (hasMore) {
      try {
        const res = await axiosInstance.get(`/chat/group/${currentGroup.id}/message`, {
          params: {
            offset: offset,
            limit: 20,
          },
        });

        // setChatMessages((prevState) => {
        //   if (prevState.length !== prevState.length + res.data.data.length) {
        //     return [...res.data.data, ...prevState];
        //   } else {
        //     setHasMore(false);
        //     return prevState;
        //   }
        // });
        // setOffset((prevState) => prevState + 20);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getPersonalMessage();
    }
    getPersonalChat();
  }, [userId]);

  return (
    <SafeAreaView style={[styles.container, { marginBottom: isKeyboardVisible ? keyboardHeight : 0 }]}>
      <ChatHeader name={name} image={image} navigation={navigation} userId={userId} />

      <Flex
        flex={1}
        bg="#FAFAFA"
        paddingX={2}
        // style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {/* <ChatSearch/> */}
        <FlashList
          // inverted
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
