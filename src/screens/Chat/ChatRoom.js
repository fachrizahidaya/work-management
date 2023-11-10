import { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import dayjs from "dayjs";

import Pusher from "pusher-js/react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from "react-redux";

import { FlashList } from "@shopify/flash-list";
import { Flex, Icon, Pressable, Spinner } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import ChatBubble from "../../components/Chat/ChatBubble/ChatBubble";
import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import ImageAttachment from "../../components/Chat/Attachment/ImageAttachment";
import { useDisclosure } from "../../hooks/useDisclosure";
import FileAttachment from "../../components/Chat/Attachment/FileAttachment";
import { useFetch } from "../../hooks/useFetch";

const ChatRoom = () => {
  const [chatList, setChatList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [previousUser, setPreviousUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [previousGroup, setPreviousGroup] = useState(null);
  const [bandAttachment, setBandAttachment] = useState(null);
  const [bandAttachmentType, setBandAttachmentType] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleteMessageDialogOpen, setDeleteMessageDialogOpen] = useState(false);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  window.Pusher = Pusher;
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const userSelector = useSelector((state) => state.auth);

  const route = useRoute();

  const navigation = useNavigation();

  const { name, userId, image, type } = route.params;

  /**
   * Message delete dialog control
   * @param {*} message
   */
  const deleteMessageDialogOpenHandler = (message) => {
    setMessageToDelete(message);
    setDeleteMessageDialogOpen(true);
  };
  const deleteMessageDialogCloseHandler = () => {
    setDeleteMessageDialogOpen(true);
  };

  /**
   * Event listener for new personal chat messages
   */
  const personalChatMessageEvent = () => {
    if (userSelector?.id && previousUser) {
      laravelEcho.leaveChannel(`personal.chat.${userSelector?.id}.${previousUser}`);
    }
    if (userSelector?.id && currentUser) {
      laravelEcho.channel(`personal.chat.${userSelector?.id}.${userId}`).listen(".personal.chat", (event) => {
        console.log(event);
        if (event.data.type === "New") {
          setChatList((prevState) => [...prevState, event.data]);
        } else {
          deleteChatFromChatMessages(event.data);
        }
      });
    }
  };

  /**
   * Event listener for new group chat messages
   */
  const groupChatMessageEvent = () => {
    if (userSelector?.id && previousGroup) {
      laravelEcho.leaveChannel(`group.chat.${previousGroup}`);
    }
    if (userSelector?.id && currentGroup) {
      laravelEcho.channel(`group.chat.${currentGroup}`).listen(".group.chat", (event) => {
        console.log(event);
        if (event.data.tye) {
          setChatList((prevState) => [...prevState, event.data]);
        } else {
          deleteChatFromChatMessages(event.data);
        }
      });
    }
  };

  /**
   * Fetch Chat Messages
   * @param {*} type
   * @param {*} id
   * @param {*} setHasBeenScrolled
   */
  const fetchChatMessage = async (type, id, setHasBeenScrolled) => {
    if (hasMore) {
      try {
        const res = await axiosInstance.get(`/chat/${type}/${id}/message`, {
          params: {
            offset: offset,
            limit: 20,
          },
        });

        setChatList((currentChats) => {
          if (currentChats.length !== currentChats.length + res.data.data.length) {
            return [...res?.data?.data, ...currentChats];
          } else {
            setHasMore(false);
            return currentChats;
          }
        });
        setOffset((prevState) => prevState + 20);
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * Handles submission of chat message
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const sendMessage = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/chat/${type}/message`, form);
      setSubmitting(false);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * Set all messages to read after opening up the chat
   * @param {*} type
   * @param {*} id
   */
  const messageReadHandler = async (type, id) => {
    try {
      await axiosInstance.get(`/chat/${type}/${id}/read-message`);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Personal message delete handler
   * @param {*} chat_message_id
   * @param {*} delete_type
   * @param {*} setIsLoading
   */
  const messagedeleteHandler = async (chat_message_id, delete_type, setIsLoading) => {
    try {
      const res = await axiosInstance.delete(`/chat/${type}/message/${delete_type}/${chat_message_id}`);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  /**
   * Handle message delete event
   * @param {*} chatMessageObj
   */
  const deleteChatFromChatMessages = (chatMessageObj) => {
    setChatList((prevState) => {
      const index = prevState.findIndex((obj) => obj.id === chatMessageObj.id);
      if (chatMessageObj.type === "Delete For Me") {
        prevState.splice(index, 1);
      } else if (chatMessageObj.type === "Delete for Everyone") {
        prevState[index].delete_for_everyone = 1;
        return [...prevState];
      }
    });
  };

  /**
   * Decide when user avatar should be rendered at
   */
  const userImageRenderCheck = useCallback(
    (currentMessage, nextMessage) => {
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");
      const nextMessageDate = dayjs(nextMessage?.created_at).format("YYYY-MM-DD");

      if (nextMessage) {
        if (currentMessage?.from_user_id !== nextMessage?.from_user_id) {
          return currentMessage?.user?.image;
        } else {
          if (dayjs(currentMessageDate).isBefore(dayjs(nextMessageDate))) {
            return currentMessage?.user?.image;
          }
          return;
        }
      } else {
        return currentMessage?.user?.image;
      }
    },
    [chatList]
  );

  /**
   * Decide when username should be rendered at
   */
  const userNameRenderCheck = useCallback(
    (prevMessage, currentMessage) => {
      const prevMessageDate = dayjs(prevMessage?.created_at).format("YYYY-MM-DD");
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");

      if (prevMessage) {
        if (prevMessage?.from_user_id !== currentMessage?.from_user_id) {
          return currentMessage?.user?.name;
        } else {
          if (dayjs(prevMessageDate).isBefore(dayjs(currentMessageDate))) {
            return currentMessage?.user?.name;
          }
          return;
        }
      } else {
        return currentMessage?.user?.name;
      }
    },
    [chatList]
  );

  /**
   * Decide when messages should be grouped closer together or not
   */
  const messageIsGrouped = useCallback(
    (currentMessage, nextMessage) => {
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");
      const nextMessageDate = dayjs(nextMessage?.created_at).format("YYYY-MM-DD");

      if (
        nextMessage &&
        currentMessage?.from_user_id == nextMessage?.from_user_id &&
        dayjs(currentMessageDate).isSame(dayjs(nextMessageDate))
      ) {
        return true;
      } else {
        return false;
      }
    },
    [chatList]
  );

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (result) {
      setFileAttachment({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  /**
   * Select file handler
   */
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          // formData format
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });

          // Call upload handler and send formData to the api
          // handleUploadFile(formData);
        } else {
          Alert.alert("Max file size is 3MB");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleUploadFile = async (formData) => {
  //   try {
  //     // Sending the formData to backend
  //     await axiosInstance.post("/pm/projects/attachment", formData, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     });
  //     // Refetch project's attachments
  //     refetchAttachments();

  //     // Display toast if success
  //     toast.show({
  //       render: ({ id }) => {
  //         return <SuccessToast message={"Attachment uploaded"} close={() => toast.close(id)} />;
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     // Display toast if error
  //     toast.show({
  //       render: ({ id }) => {
  //         return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
  //       },
  //     });
  //   }
  // };

  const clearAdditionalContentActionState = () => {
    setFileAttachment(null);
    setBandAttachment(null);
    setBandAttachmentType(null);
    setMessageToReply(null);
    setMessageToDelete(null);
  };

  const fetchChatMessageHandler = (read) => {
    if (type === "personal") {
      if (currentUser) {
        fetchChatMessage(type, currentUser);
        if (read) {
          messageReadHandler(type, currentUser);
        }
      }
    } else if (type === "group") {
      if (currentGroup) {
        fetchChatMessage(type, currentGroup);
        if (read) {
          messageReadHandler(type, currentGroup);
        }
      }
    }
  };

  useEffect(() => {
    personalChatMessageEvent();
  }, [currentUser]);

  useEffect(() => {
    groupChatMessageEvent();
  }, [currentGroup]);

  useEffect(() => {
    setChatList([]);
    setCurrentUser(userId);
    setPreviousUser(currentUser);
    setHasMore(true);
    setOffset(0);
    clearAdditionalContentActionState();
  }, [userId]);

  useEffect(() => {
    setChatList([]);
    setCurrentGroup(userId);
    setPreviousGroup(currentGroup);
    setHasMore(true);
    setOffset(0);
    clearAdditionalContentActionState();
  }, [userId]);

  useEffect(() => {
    fetchChatMessageHandler(true);
  }, [currentUser, currentGroup, type]);

  useEffect(() => {
    const { routes } = navigation.getState();
    const filteredRoutes = routes.filter(
      (route) => route.name !== "New Chat" && route.name !== "Group Form" && route.name !== "Group Participant"
    );
    navigation.reset({ index: filteredRoutes.length - 1, routes: filteredRoutes });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { marginBottom: Platform.OS === "ios" && keyboardHeight }]}>
      <ChatHeader name={name} image={image} navigation={navigation} userId={userId} fileAttachment={fileAttachment} />

      <Flex flex={1} bg="#FAFAFA" paddingX={3} position="relative">
        <FlashList
          // inverted
          keyExtractor={(item, index) => index}
          onScrollBeginDrag={() => setHasBeenScrolled(true)}
          onEndReached={hasBeenScrolled ? () => fetchChatMessageHandler() : null}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          data={chatList}
          renderItem={({ item, index }) => (
            <ChatBubble
              index={index}
              chat={item}
              image={userImageRenderCheck(item, chatList[index + 1])}
              name={userNameRenderCheck(chatList[index - 1], item)}
              fromUserId={item.from_user_id}
              id={item.id}
              content={item.message}
              type={type}
              time={item.created_time}
              chatList={chatList}
              onMessageReply={setMessageToReply}
              onMessageDelete={deleteMessageDialogOpenHandler}
              isGrouped={messageIsGrouped(item, chatList[index + 1])}
            />
          )}
        />
        {fileAttachment ? (
          <Flex px={5} py={5} gap={5} bgColor="white" position="absolute" top={0} bottom={0} left={0} right={0}>
            <Flex flexDir="row" justifyContent="end" alignItems="flex-end">
              <Pressable onPress={() => setFileAttachment(null)}>
                <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
              </Pressable>
            </Flex>
            {fileAttachment.type === "image/jpg" ? (
              <ImageAttachment image={fileAttachment} setImage={setFileAttachment} />
            ) : (
              <FileAttachment file={fileAttachment} setFile={setFileAttachment} />
            )}
          </Flex>
        ) : null}
      </Flex>

      <ChatInput
        userId={userId}
        type={type}
        fileAttachment={fileAttachment}
        selectFile={selectFile}
        pickImageHandler={pickImageHandler}
        sendMessage={sendMessage}
        setFileAttachment={(file) => {
          setFileAttachment(file);
          setBandAttachment(null);
          setBandAttachmentType(null);
        }}
        bandAttachment={bandAttachment}
        setBandAttachment={setBandAttachment}
        bandAttachmentType={bandAttachmentType}
        setBandAttachmentType={(type) => {
          setBandAttachmentType(type);
          setFileAttachment(null);
        }}
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
      />
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
