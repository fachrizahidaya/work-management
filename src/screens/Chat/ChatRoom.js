import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import Pusher from "pusher-js/react-native";

import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet } from "react-native";

import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import ChatList from "../../components/Chat/ChatList/ChatList";

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

  /**
   * Clean all state after change chat
   */
  const clearAdditionalContentActionState = () => {
    setFileAttachment(null);
    setBandAttachment(null);
    setBandAttachmentType(null);
    setMessageToReply(null);
    setMessageToDelete(null);
  };

  /**
   * Trigger fetch all chat messages
   * @param {*} read
   */
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

      <ChatList
        name={name}
        userId={userId}
        image={image}
        type={type}
        offset={offset}
        chatList={chatList}
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
        deleteMessageDialogOpenHandler={deleteMessageDialogOpenHandler}
        fileAttachment={fileAttachment}
        setFileAttachment={setFileAttachment}
        fetchChataMessageHandler={fetchChatMessageHandler}
      />

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
