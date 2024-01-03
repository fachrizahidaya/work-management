import { useEffect, useState, useCallback, useRef } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import Pusher from "pusher-js/react-native";

import { SafeAreaView, StyleSheet, Keyboard } from "react-native";
import Toast from "react-native-toast-message";

import axiosInstance from "../../config/api";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import ChatList from "../../components/Chat/ChatList/ChatList";
import ChatOptionMenu from "../../components/Chat/ChatBubble/ChatOptionMenu";
import ChatMessageDeleteModal from "../../components/Chat/ChatBubble/ChatMessageDeleteModal";
import ImageFullScreenModal from "../../components/shared/ImageFullScreenModal";
import RemoveConfirmationModal from "../../components/shared/RemoveConfirmationModal";
import MenuAttachment from "../../components/Chat/ChatInput/MenuAttachment";
import ClearChatAction from "../../components/Chat/ChatList/ClearChatAction";

const ChatRoom = () => {
  const [chatList, setChatList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [bandAttachment, setBandAttachment] = useState(null);
  const [bandAttachmentType, setBandAttachmentType] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChatBubble, setSelectedChatBubble] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [placement, setPlacement] = useState(undefined);
  const [selectedChatToDelete, setSelectedChatToDelete] = useState(null);
  const [chatBubblePos, setChatBubblePos] = useState(false);

  const swipeToReply = (message) => {
    setMessageToReply(message);
  };

  window.Pusher = Pusher;
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const userSelector = useSelector((state) => state.auth);

  const route = useRoute();

  const { userId, name, roomId, image, position, email, type, active_member, isPinned } = route.params;

  const navigation = useNavigation();

  const clearChatScreenSheetRef = useRef(null);
  const menuAttachmentScreenSheetRef = useRef(null);
  const menuHeaderScreenSheetRef = useRef(null);

  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } = useDisclosure(false);
  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: optionIsOpen, toggle: toggleOption } = useDisclosure(false);
  const { isOpen: deleteModalChatIsOpen, toggle: toggleDeleteModalChat } = useDisclosure(false);
  const { isOpen: clearChatMessageIsOpen, toggle: toggleClearChatMessage } = useDisclosure(false);
  const { isOpen: menuIsOpen, toggle: toggleMenu } = useDisclosure(false);

  const { isLoading: deleteChatMessageIsLoading, toggle: toggleDeleteChatMessage } = useLoading(false);
  const { isLoading: chatRoomIsLoading, toggle: toggleChatRoom } = useLoading(false);
  const { isLoading: clearMessageIsLoading, toggle: toggleClearMessage } = useLoading(false);
  const { isLoading: chatIsLoading, stop: stopLoadingChat, start: startLoadingChat } = useLoading(false);

  /**
   * Open chat options handler
   * @param {*} chat
   */
  const openChatBubbleHandler = (chat, placement) => {
    setChatBubblePos(true);
    setSelectedChatBubble(chat);
    setPlacement(placement);
    toggleOption();
  };

  /**
   * Close chat options handler
   */
  const closeChatBubbleHandler = () => {
    setChatBubblePos(false);
    setSelectedChatBubble(null);
    toggleOption();
  };

  const openAddAttachmentHandler = () => {
    menuAttachmentScreenSheetRef.current?.show();
    Keyboard.dismiss();
  };

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = (chat) => {
    setSelectedChatBubble(chat);
    setIsFullScreen(!isFullScreen);
  };

  const openDeleteChatMessageHandler = () => {
    setSelectedChatToDelete(selectedChatBubble);
    toggleDeleteModalChat();
  };

  /**
   * Event listener for new personal chat messages
   */
  const personalChatMessageEvent = () => {
    if (userSelector?.id && currentUser) {
      laravelEcho.channel(`personal.chat.${userSelector?.id}.${userId}`).listen(".personal.chat", (event) => {
        if (event.data.type === "New") {
          stopLoadingChat();
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
    if (userSelector?.id && currentUser) {
      laravelEcho.channel(`group.chat.${currentUser}.${userSelector?.id}`).listen(".group.chat", (event) => {
        if (event.data.type === "New") {
          stopLoadingChat();
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
   */
  const { mutate, variables } = useMutation(
    (chat) => {
      startLoadingChat();
      return axiosInstance.post(`/chat/${type}/message`, chat, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    },
    {
      onSettled: () => {
        if (currentUser === null) {
          setCurrentUser(res.data.data?.chat_personal_id);
        }
      },
      onError: (error) => {
        stopLoadingChat();
        console.log(error);

        Toast.show({
          type: "error",
          text1: error.response.data.message,
        });
      },
    }
  );

  const renderChats = chatIsLoading
    ? [
        {
          message: variables?._parts[3][1],
          from_user_id: userSelector.id,
          file_name: variables?._parts[4][1]?.name,
          file_path: variables?._parts[4][1]?.uri,
          mime_type: variables?._parts[4][1]?.type,
          project_id: variables?._parts[5][1],
          project_no: variables?._parts[6][1],
          project_title: variables?._parts[7][1],
          task_id: variables?._parts[8][1],
          task_no: variables?._parts[9][1],
          task_title: variables?._parts[10][1],
          isOptimistic: true,
        },
        ...chatList,
      ]
    : chatList;

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
      toggleDeleteChatMessage();
      await axiosInstance.delete(`/chat/personal/${id}`);
      toggleDeleteChatMessage();
      toggleDeleteModal();
      navigation.navigate("Chat List");
      Toast.show({
        type: "success",
        text1: "Chat deleted",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      toggleDeleteChatMessage();
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  /**
   * Handle chat message clear event
   *
   * @param {*} id - Personal chat id / Group chat id
   */
  const clearChatMessageHandler = async (id, type, itemName) => {
    try {
      toggleClearMessage();
      await axiosInstance.delete(`/chat/${type}/${id}/message/clear`);
      toggleClearMessage();
      navigation.navigate("Chat List");
      Toast.show({
        type: "success",
        text1: "Chat cleared",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      toggleClearMessage();
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  /**
   * Handle chat pin update event
   *
   * @param {*} id - Personal chat id / Group chat id
   * @param {*} action - either pin/unpin
   */
  const chatPinUpdateHandler = async (chatType, id, action) => {
    try {
      await axiosInstance.patch(`/chat/${chatType}/${id}/${action}`);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${roomId}/member`);
      setSelectedGroupMembers(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const memberName = selectedGroupMembers.map((item) => {
    return {
      id: item.user.id,
      name: item.user.name,
    };
  });

  /**
   * Exit group handler
   * @param {*} group_id
   */
  const groupExitHandler = async (group_id) => {
    try {
      toggleChatRoom();
      await axiosInstance.post(`/chat/group/exit`, { group_id: group_id });
      toggleChatRoom();
      toggleExitModal();
      navigation.navigate("Chat List");
      Toast.show({
        type: "success",
        text1: "Group exited",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      toggleChatRoom();
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
      navigation.navigate("Chat List");
      Toast.show({
        type: "success",
        text1: "Group deleted",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      toggleChatRoom(false);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChatMessageHandler(true);
    }
  }, [currentUser, type, isPinned]);

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [currentUser, roomId]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        /**
         * To reset all state
         */
        if (type === "personal") {
          laravelEcho.leaveChannel(`personal.chat.${userSelector?.id}.${roomId}`);
        } else {
          laravelEcho.leaveChannel(`group.chat.${userId}.${userSelector?.id}`);
        }
        setHasMore(true);
        setOffset(0);
        clearAdditionalContentActionState();
      };
    }, [])
  );

  useEffect(() => {
    /**
     * To fill all state
     */
    if (roomId) {
      setCurrentUser(roomId);
    }
    setHasMore(true);
    setOffset(0);
    clearAdditionalContentActionState();
    personalChatMessageEvent();
    groupChatMessageEvent();
  }, [roomId, currentUser]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  /**
   * Handle return after create new message group or personal
   */
  useEffect(() => {
    const { routes } = navigation.getState();
    const filteredRoutes = routes.filter(
      (route) => route.name !== "New Chat" && route.name !== "Group Form" && route.name !== "Group Participant"
    );
    navigation.reset({ index: filteredRoutes.length - 1, routes: filteredRoutes });
  }, []);

  return (
    <>
      {isReady ? (
        <SafeAreaView style={[styles.container, { marginBottom: Platform.OS === "ios" && keyboardHeight }]}>
          <>
            <ChatHeader
              name={name}
              image={image}
              position={position}
              email={email}
              fileAttachment={fileAttachment}
              type={type}
              active_member={active_member}
              roomId={roomId}
              isPinned={isPinned}
              isLoading={isLoading}
              loggedInUser={userSelector?.id}
              toggleExitModal={toggleExitModal}
              toggleDeleteGroupModal={toggleDeleteGroupModal}
              toggleDeleteModal={toggleDeleteModal}
              toggleClearChatMessage={toggleClearChatMessage}
              toggleDeleteChatMessage={toggleDeleteChatMessage}
              selectedGroupMembers={selectedGroupMembers}
              deleteModalIsOpen={deleteModalIsOpen}
              exitModalIsOpen={exitModalIsOpen}
              deleteGroupModalIsOpen={deleteGroupModalIsOpen}
              deleteChatMessageIsLoading={deleteChatMessageIsLoading}
              chatRoomIsLoading={chatRoomIsLoading}
              deleteChatPersonal={deleteChatPersonal}
              onUpdatePinHandler={chatPinUpdateHandler}
              reference={menuHeaderScreenSheetRef}
            />

            <ChatList
              type={type}
              chatList={renderChats}
              fileAttachment={fileAttachment}
              setFileAttachment={setFileAttachment}
              fetchChatMessageHandler={fetchChatMessageHandler}
              bandAttachment={bandAttachment}
              setBandAttachment={setBandAttachment}
              bandAttachmentType={bandAttachmentType}
              isLoading={isLoading}
              openChatBubbleHandler={openChatBubbleHandler}
              toggleFullScreen={toggleFullScreen}
              onSwipeToReply={swipeToReply}
              placement={placement}
              memberName={memberName}
              position={chatBubblePos}
            />

            <ChatInput
              userId={userId}
              roomId={roomId}
              type={type}
              active_member={active_member}
              fileAttachment={fileAttachment}
              setFileAttachment={setFileAttachment}
              bandAttachment={bandAttachment}
              setBandAttachment={setBandAttachment}
              bandAttachmentType={bandAttachmentType}
              setBandAttachmentType={setBandAttachmentType}
              messageToReply={messageToReply}
              setMessageToReply={setMessageToReply}
              onSendMessage={mutate}
              toggleMenu={openAddAttachmentHandler}
              groupMember={selectedGroupMembers}
            />
          </>

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
            isLoading={type === "group" ? chatRoomIsLoading : deleteChatMessageIsLoading}
          />

          <ClearChatAction
            isOpen={clearChatMessageIsOpen}
            onClose={toggleClearChatMessage}
            name={name}
            isLoading={clearMessageIsLoading}
            clearChat={() => clearChatMessageHandler(roomId, type, toggleClearMessage)}
            reference={clearChatScreenSheetRef}
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
            toggleDeleteModal={openDeleteChatMessageHandler}
            placement={placement}
          />

          <ChatMessageDeleteModal
            id={selectedChatToDelete?.id}
            isDeleted={selectedChatToDelete?.delete_for_everyone}
            deleteModalChatIsOpen={deleteModalChatIsOpen}
            toggleDeleteModalChat={toggleDeleteModalChat}
            myMessage={userSelector?.id === selectedChatToDelete?.from_user_id}
            isLoading={deleteChatMessageIsLoading}
            onDeleteMessage={messagedeleteHandler}
          />

          <MenuAttachment
            isOpen={menuIsOpen}
            onClose={toggleMenu}
            selectFile={selectFile}
            pickImageHandler={pickImageHandler}
            navigation={navigation}
            bandAttachment={bandAttachment}
            setBandAttachment={setBandAttachment}
            bandAttachmentType={bandAttachmentType}
            setBandAttachmentType={setBandAttachmentType}
            name={name}
            userId={userId}
            roomId={roomId}
            image={image}
            position={position}
            email={email}
            type={type}
            active_member={active_member}
            isPinned={isPinned}
            reference={menuAttachmentScreenSheetRef}
          />
        </SafeAreaView>
      ) : null}
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
