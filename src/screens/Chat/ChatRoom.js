import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import Pusher from "pusher-js/react-native";

import { SafeAreaView, StyleSheet } from "react-native";

import axiosInstance from "../../config/api";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import ChatList from "../../components/Chat/ChatList/ChatList";
import { useCallback } from "react";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "native-base";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";

const ChatRoom = () => {
  const [chatList, setChatList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [previousUser, setPreviousUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [bandAttachment, setBandAttachment] = useState(null);
  const [bandAttachmentType, setBandAttachmentType] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  window.Pusher = Pusher;
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const userSelector = useSelector((state) => state.auth);

  const route = useRoute();

  const {
    name,
    userId,
    image,
    position,
    email,
    type,
    active_member,
    setForceRender,
    forceRender,
    selectedGroupMembers,
  } = route.params;

  const navigation = useNavigation();

  const toast = useToast();

  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } = useDisclosure(false);
  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

  const closeDeleteChatModalHandler = () => {
    toggleDeleteModal();
    navigation.goBack();
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
        if (event.data.type === "New") {
          setChatList((prevState) => [event.data, ...prevState]);
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
    if (userSelector?.id && previousUser) {
      laravelEcho.leaveChannel(`group.chat.${previousUser}.${userSelector?.id}`);
    }
    if (userSelector?.id && currentUser) {
      laravelEcho.channel(`group.chat.${currentUser}.${userSelector?.id}`).listen(".group.chat", (event) => {
        if (event.data.type === "New") {
          setChatList((prevState) => [event.data, ...prevState]);
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
    if (hasMore && !isLoading) {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/chat/${type}/${id}/message`, {
          params: {
            offset: offset,
            limit: 20,
            sort: "desc",
          },
        });

        setChatList((currentChats) => {
          if (currentChats.length !== currentChats.length + res?.data?.data.length) {
            return [...currentChats, ...res?.data?.data];
          } else {
            setHasMore(false);
            return currentChats;
          }
        });
        setOffset((prevState) => prevState + 20);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Handles submission of chat message
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const sendMessageHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/chat/${type}/message`, form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
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
      setIsLoading(true);
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
      } else if (chatMessageObj.type === "Delete For Everyone") {
        prevState[index].delete_for_everyone = 1;
      }
      return [...prevState];
    });
  };

  const deleteChatPersonal = async (id, setIsLoading) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.delete(`/chat/personal/${id}`);
      setIsLoading(false);
      toggleDeleteModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Chat Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
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
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });
        } else {
          Alert.alert("Max file size is 3MB");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      if (currentUser) {
        fetchChatMessage(type, currentUser);
        if (read) {
          messageReadHandler(type, currentUser);
        }
      }
    }
  };

  const groupExitHandler = async (group_id, setIsLoading) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/chat/group/exit`, { group_id: group_id });
      setForceRender(!forceRender);
      setIsLoading(false);
      toggleExitModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Exited" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  const groupDeleteHandler = async (group_id, setIsLoading) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.delete(`/chat/group/${group_id}`);
      setIsLoading(false);
      toggleDeleteGroupModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    fetchChatMessageHandler(true);
  }, [currentUser, type]);

  useEffect(() => {
    const { routes } = navigation.getState();
    const filteredRoutes = routes.filter(
      (route) => route.name !== "New Chat" && route.name !== "Group Form" && route.name !== "Group Participant"
    );
    navigation.reset({ index: filteredRoutes.length - 1, routes: filteredRoutes });
  }, []);

  useFocusEffect(
    useCallback(() => {
      /**
       * When screen is focused
       */
      setCurrentUser(userId);
      setPreviousUser(currentUser);
      setHasMore(true);
      setOffset(0);
      clearAdditionalContentActionState();
      personalChatMessageEvent();
      groupChatMessageEvent();

      return () => {
        /**
         * When screen is unfocused
         */
        setChatList([]);
        setCurrentUser(null);
        setPreviousUser(currentUser);
        setHasMore(true);
        setOffset(0);
        clearAdditionalContentActionState();
      };
    }, [userId, currentUser])
  );

  return (
    <SafeAreaView style={[styles.container, { marginBottom: Platform.OS === "ios" && keyboardHeight }]}>
      <ChatHeader
        name={name}
        image={image}
        position={position}
        email={email}
        navigation={navigation}
        userId={userId}
        fileAttachment={fileAttachment}
        type={type}
        active_member={active_member}
        groupExitHandler={groupExitHandler}
        groupDeleteHandler={groupDeleteHandler}
        exitModalIsOpen={exitModalIsOpen}
        deleteGroupModalIsOpen={deleteGroupModalIsOpen}
        toggleExitModal={toggleExitModal}
        toggleDeleteGroupModal={toggleDeleteGroupModal}
        selectedGroupMembers={selectedGroupMembers}
        loggedInUser={userSelector?.id}
        deleteChatPersonal={deleteChatPersonal}
        toggleDeleteModal={toggleDeleteModal}
        deleteModalIsOpen={deleteModalIsOpen}
      />

      <ChatList
        type={type}
        chatList={chatList}
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
        deleteMessage={messagedeleteHandler}
        fileAttachment={fileAttachment}
        setFileAttachment={setFileAttachment}
        fetchChatMessageHandler={fetchChatMessageHandler}
        bandAttachment={bandAttachment}
        setBandAttachment={setBandAttachment}
        bandAttachmentType={bandAttachmentType}
        setBandAttachmentType={setBandAttachmentType}
        isLoading={isLoading}
      />

      <ChatInput
        userId={userId}
        type={type}
        fileAttachment={fileAttachment}
        selectFile={selectFile}
        pickImageHandler={pickImageHandler}
        sendMessage={sendMessageHandler}
        setFileAttachment={setFileAttachment}
        bandAttachment={bandAttachment}
        setBandAttachment={setBandAttachment}
        bandAttachmentType={bandAttachmentType}
        setBandAttachmentType={setBandAttachmentType}
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
        active_member={active_member}
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
