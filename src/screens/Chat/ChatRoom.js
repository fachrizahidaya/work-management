import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import Pusher from "pusher-js/react-native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, HStack, Skeleton, Spinner, VStack, useToast } from "native-base";

import axiosInstance from "../../config/api";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import ChatList from "../../components/Chat/ChatList/ChatList";
import ChatOptionMenu from "../../components/Chat/ChatBubble/ChatOptionMenu";
import ChatMessageDeleteModal from "../../components/Chat/ChatBubble/ChatMessageDeleteModal";
import ImageFullScreenModal from "../../components/Chat/ChatBubble/ImageFullScreenModal";
import RemoveConfirmationModal from "../../components/Chat/ChatHeader/RemoveConfirmationModal";
import ProjectAttachment from "../../components/Chat/Attachment/ProjectAttachment";
import TaskAttachment from "../../components/Chat/Attachment/TaskAttachment";
import ImageAttachment from "../../components/Chat/Attachment/ImageAttachment";
import FileAttachment from "../../components/Chat/Attachment/FileAttachment";
import ProjectTaskAttachmentPreview from "../../components/Chat/Attachment/ProjectTaskAttachmentPreview";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChatBubble, setSelectedChatBubble] = useState(null);
  const [isReady, setIsReady] = useState(false);

  window.Pusher = Pusher;
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const userSelector = useSelector((state) => state.auth);

  const route = useRoute();

  const {
    name,
    userId,
    roomId,
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
  const { isOpen: optionIsOpen, toggle: toggleOption } = useDisclosure(false);
  const { isOpen: deleteModalChatIsOpen, toggle: toggleDeleteModalChat } = useDisclosure(false);
  const { isOpen: taskListIsOpen, toggle: toggleTaskList } = useDisclosure(false);
  const { isOpen: projectListIsOpen, toggle: toggleProjectList } = useDisclosure(false);

  const { isLoading: isLoadingDeleteChatMessage, toggle: toggleDeleteChatMessage } = useLoading(false);
  const { isLoading: isLoadingChatRoom, toggle: toggleChatRoom } = useLoading(false);

  /**
   * Open chat options handler
   * @param {*} chat
   */
  const openChatBubbleHandler = (chat) => {
    setSelectedChatBubble(chat);
    toggleOption();
  };

  /**
   * Close chat options handler
   */
  const closeChatBubbleHandler = () => {
    setSelectedChatBubble(null);
    toggleOption();
  };

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = (chat) => {
    setSelectedChatBubble(chat);
    setIsFullScreen(!isFullScreen);
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
            limit: 50,
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
        setOffset((prevState) => prevState + 50);
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
  const messagedeleteHandler = async (chat_message_id, delete_type) => {
    try {
      toggleDeleteChatMessage();
      await axiosInstance.delete(`/chat/${type}/message/${delete_type}/${chat_message_id}`);
      toggleOption();
      toggleDeleteModalChat();
      toggleDeleteChatMessage();
    } catch (err) {
      console.log(err);
      toggleDeleteChatMessage();
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

  /**
   * Delete chat room personal handler
   * @param {*} id
   */
  const deleteChatPersonal = async (id) => {
    try {
      toggleChatRoom();
      await axiosInstance.delete(`/chat/personal/${id}`);
      toggleChatRoom();
      toggleDeleteModal();
      navigation.navigate("Chat List");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Chat Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleChatRoom();
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

  /**
   * Exit group handler
   * @param {*} group_id
   */
  const groupExitHandler = async (group_id) => {
    try {
      toggleChatRoom();
      await axiosInstance.post(`/chat/group/exit`, { group_id: group_id });
      setForceRender(!forceRender);
      toggleChatRoom();
      toggleExitModal();
      navigation.navigate("Chat List");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Exited" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleChatRoom();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Delete group after exit group handler
   * @param {*} group_id
   */
  const groupDeleteHandler = async (group_id) => {
    try {
      toggleChatRoom();
      await axiosInstance.delete(`/chat/group/${group_id}`);
      toggleChatRoom();
      toggleDeleteGroupModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleChatRoom(false);
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
      setCurrentUser(roomId);
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
    }, [roomId, currentUser])
  );

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <>
      <SafeAreaView style={[styles.container, { marginBottom: Platform.OS === "ios" && keyboardHeight }]}>
        {isReady ? (
          <>
            <ChatHeader
              name={name}
              image={image}
              position={position}
              email={email}
              navigation={navigation}
              fileAttachment={fileAttachment}
              type={type}
              active_member={active_member}
              toggleExitModal={toggleExitModal}
              toggleDeleteGroupModal={toggleDeleteGroupModal}
              selectedGroupMembers={selectedGroupMembers}
              loggedInUser={userSelector?.id}
              toggleDeleteModal={toggleDeleteModal}
              deleteModalIsOpen={deleteModalIsOpen}
              exitModalIsOpen={exitModalIsOpen}
              deleteGroupModalIsOpen={deleteGroupModalIsOpen}
              deleteChatPersonal={deleteChatPersonal}
              roomId={roomId}
              isLoadingDeleteChatMessage={isLoadingDeleteChatMessage}
              isLoadingChatRoom={isLoadingChatRoom}
              toggleDeleteChatMessage={toggleDeleteChatMessage}
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
              openChatBubbleHandler={openChatBubbleHandler}
              toggleFullScreen={toggleFullScreen}
            />

            <ChatInput
              userId={userId}
              roomId={roomId}
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
              toggleProjectList={toggleProjectList}
              toggleTaskList={toggleTaskList}
            />
          </>
        ) : (
          <VStack mt={10} px={4} space={2}>
            <Spinner color="primary.600" size="lg" />
          </VStack>
        )}
      </SafeAreaView>

      <RemoveConfirmationModal
        isOpen={
          type === "personal" ? deleteModalIsOpen : active_member === 1 ? exitModalIsOpen : deleteGroupModalIsOpen
        }
        toggle={
          type === "personal" ? toggleDeleteModal : active_member === 1 ? toggleExitModal : toggleDeleteGroupModal
        }
        description={
          type === "personal"
            ? "Are you sure want to delete this chat?"
            : type === "group" && active_member === 1
            ? "Are you sure want to exit this group?"
            : type === "group" && active_member === 0
            ? "Are you sure want to delete this group?"
            : null
        }
        onPress={() =>
          type === "personal"
            ? deleteChatPersonal(roomId, toggleDeleteChatMessage)
            : type === "group" && active_member === 1
            ? groupExitHandler(roomId, toggleChatRoom)
            : type === "group" && active_member === 0
            ? groupDeleteHandler(roomId, toggleChatRoom)
            : null
        }
        isLoading={type === "group" ? isLoadingChatRoom : isLoadingDeleteChatMessage}
      />

      <ImageFullScreenModal
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        file_path={selectedChatBubble}
      />

      <ChatOptionMenu
        optionIsOpen={optionIsOpen}
        onClose={closeChatBubbleHandler}
        setMessageToReply={setMessageToReply}
        chat={selectedChatBubble}
        toggleDeleteModal={toggleDeleteModalChat}
      />

      <ChatMessageDeleteModal
        id={selectedChatBubble?.id}
        deleteMessage={messagedeleteHandler}
        deleteModalChatIsOpen={deleteModalChatIsOpen}
        toggleDeleteModalChat={toggleDeleteModalChat}
        myMessage={userSelector?.id === selectedChatBubble?.from_user_id}
        isDeleted={selectedChatBubble?.delete_for_everyone}
        isLoading={isLoadingDeleteChatMessage}
      />

      {fileAttachment && (
        <>
          {fileAttachment.type === "image/jpg" ? (
            <ImageAttachment image={fileAttachment} setImage={setFileAttachment} />
          ) : (
            <FileAttachment file={fileAttachment} setFile={setFileAttachment} />
          )}
        </>
      )}

      {bandAttachment && (
        <ProjectTaskAttachmentPreview
          bandAttachmentType={bandAttachmentType}
          bandAttachment={bandAttachment}
          setBandAttachment={setBandAttachment}
        />
      )}

      <ProjectAttachment
        projectListIsOpen={projectListIsOpen}
        toggleProjectList={toggleProjectList}
        setBandAttachment={setBandAttachment}
      />

      <TaskAttachment
        taskListIsOpen={taskListIsOpen}
        toggleTaskList={toggleTaskList}
        setBandAttachment={setBandAttachment}
      />
    </>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
