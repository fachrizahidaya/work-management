import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";

import { useWebsocketContext } from "../../../HOC/WebsocketContextProvider";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useLoading } from "../../../hooks/useLoading";
import axiosInstance from "../../../config/api";
import RemoveConfirmationModal from "../../../components/shared/RemoveConfirmationModal";
import GlobalSearchInput from "../../../components/Chat/GlobalSearchInput/GlobalSearchInput";
import GroupSection from "../../../components/Chat/GroupSection/GroupSection";
import PersonalSection from "../../../components/Chat/PersonalSection/PersonalSection";
import GlobalSearchChatSection from "../../../components/Chat/GlobalSearchChatSection/GlobalSearchChatSection";
import ContactMenu from "../../../components/Chat/ContactListItem/ContactMenu";
import { SheetManager } from "react-native-actions-sheet";
import {
  ErrorToastProps,
  SuccessToastProps,
} from "../../../components/shared/CustomStylings";
import PageHeader from "../../../components/shared/PageHeader";

const ChatListScreen = () => {
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho } = useWebsocketContext();
  const [globalKeyword, setGlobalKeyword] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);

  const searchFromRef = useRef(null);
  const scrollRef = useRef(null);

  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } =
    useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } =
    useDisclosure(false);
  const { isOpen: clearChatMessageIsOpen, toggle: toggleClearChatMessage } =
    useDisclosure(false);
  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } =
    useDisclosure(false);

  const {
    isLoading: deleteChatMessageIsLoading,
    toggle: toggleDeleteChatMessage,
  } = useLoading(false);
  const { isLoading: chatRoomIsLoading, toggle: toggleChatRoom } =
    useLoading(false);
  const { isLoading: clearMessageIsLoading, toggle: toggleClearMessage } =
    useLoading(false);

  const userFetchParameters = {
    page: currentPage,
    limit: 1000,
  };

  /**
   * Event listener for new chats
   */
  const personalChatEvent = () => {
    laravelEcho
      .channel(`personal.list.${userSelector?.id}`)
      .listen(".personal.list", (event) => {
        setPersonalChats(event.data);
      });
  };

  /**
   * Event listener for new group chats
   */
  const groupChatEvent = () => {
    laravelEcho
      .channel(`group.list.${userSelector.id}`)
      .listen(".group.list", (event) => {
        setGroupChats(event.data);
      });
  };

  /**
   * Fetch all personal chats
   */
  const fetchPersonalChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/personal");
      setPersonalChats(res.data.data);
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Fetch all personal chats
   */
  const fetchGroupChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/group");
      setGroupChats(res.data.data);
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  const { data: searchResult } = useFetch(
    "/chat/global-search",
    [globalKeyword],
    { search: globalKeyword }
  );

  const { data: user } = useFetch(
    "/chat/user",
    [currentPage],
    userFetchParameters
  );

  /**
   * Handle for mention name in group member
   */
  const memberName = user?.data?.data.map((item) => {
    return item?.name;
  });

  /**
   * Delete message Handler
   */
  const openSelectedChatHandler = (contact) => {
    setSelectedChat(contact);
    toggleDeleteModal();
  };

  const closeSelectedChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteModal();
  };

  /**
   * Clear personal chat message handler
   */
  const openSelectedChatToClearHandler = (contact) => {
    setSelectedChat(contact);
    toggleClearChatMessage();
  };

  const closeSelectedChatToClearHandler = () => {
    setSelectedChat(null);
    toggleClearChatMessage();
  };

  /**
   * Clear group chat message handler
   */
  const openSelectedGroupChatHandler = (contact) => {
    setSelectedChat(contact);
    toggleDeleteGroupModal();
  };

  const closeSelectedGroupChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteGroupModal();
  };

  /**
   * Swipe Contact List Item handler
   * @param {*} contact
   */
  const contactMenuHandler = (contact) => {
    setSelectedContact(contact);
    SheetManager.show("form-sheet", {
      payload: {
        children: (
          <ContactMenu
            chat={contact}
            toggleDeleteModal={openSelectedChatHandler}
            toggleDeleteGroupModal={openSelectedGroupChatHandler}
            toggleClearChatMessage={openSelectedChatToClearHandler}
            loggedInUser={userSelector?.id}
            toggleDeleteChatMessage={toggleDeleteChatMessage}
            toggleExitModal={toggleExitModal}
            deleteModalIsOpen={deleteModalIsOpen}
            exitModalIsOpen={exitModalIsOpen}
            deleteGroupModalIsOpen={deleteGroupModalIsOpen}
            deleteChatPersonal={deleteChatPersonal}
            deleteChatMessageIsLoading={deleteChatMessageIsLoading}
            chatRoomIsLoading={chatRoomIsLoading}
            navigation={navigation}
          />
        ),
      },
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
      Toast.show("Chat deleted", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleDeleteChatMessage();
      Toast.show(err.response.data.message, ErrorToastProps);
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
      Toast.show("Group deleted", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleChatRoom(false);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle clear chat
   * @param {*} id
   * @param {*} type
   * @param {*} itemName
   */
  const clearChatMessageHandler = async (id, type, itemName) => {
    try {
      toggleClearMessage();
      await axiosInstance.delete(`/chat/${type}/${id}/message/clear`);
      toggleClearMessage();
      toggleClearChatMessage();
      Toast.show("Chat cleared", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleClearMessage();
      Toast.show(err.response.data.message, ErrorToastProps);
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
      const res = await axiosInstance.patch(
        `/chat/${chatType}/${id}/${action}`
      );
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  useEffect(() => {
    fetchPersonalChats();
    fetchGroupChats();
  }, []);

  useEffect(() => {
    personalChatEvent();
    groupChatEvent();
  }, [userSelector.id, groupChats, personalChats]);

  // Removes chat room screen from stack if app opens by pressing push notification
  useEffect(() => {
    const { routes } = navigation.getState();

    const filteredRoutes = routes.filter((route) => route.name !== "Chat Room");

    navigation.reset({
      index: filteredRoutes.length - 1,
      routes: filteredRoutes,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, []);

  return (
    <>
      {isReady ? (
        <>
          <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
              <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
                <PageHeader title="Chats" onPress={() => navigation.goBack()} />
              </View>

              <GlobalSearchInput
                globalKeyword={globalKeyword}
                setGlobalKeyword={setGlobalKeyword}
                searchFormRef={searchFromRef}
              />

              <GroupSection
                groupChats={groupChats}
                searchKeyword={globalKeyword}
                searchResult={searchResult?.group}
                clickMoreHandler={contactMenuHandler}
                onPinControl={chatPinUpdateHandler}
                navigation={navigation}
                userSelector={userSelector}
                scrollRef={scrollRef}
              />

              <PersonalSection
                personalChats={personalChats}
                searchKeyword={globalKeyword}
                searchResult={searchResult?.personal}
                clickMoreHandler={contactMenuHandler}
                onPinControl={chatPinUpdateHandler}
                navigation={navigation}
                userSelector={userSelector}
                scrollRef={scrollRef}
              />

              {searchResult?.message?.length > 0 && (
                <GlobalSearchChatSection
                  searchResult={searchResult}
                  globalKeyword={globalKeyword}
                  memberName={memberName}
                />
              )}
            </ScrollView>
          </SafeAreaView>

          {selectedChat?.pin_personal ? (
            <RemoveConfirmationModal
              isLoading={deleteChatMessageIsLoading}
              isOpen={deleteModalIsOpen}
              toggle={closeSelectedChatHandler}
              onPress={() => deleteChatPersonal(selectedChat?.id)}
              description="Are you sure want to delete this chat?"
            />
          ) : null}
          {selectedChat?.pin_group ? (
            <RemoveConfirmationModal
              isLoading={chatRoomIsLoading}
              isOpen={deleteGroupModalIsOpen}
              toggle={closeSelectedGroupChatHandler}
              onPress={() => groupDeleteHandler(selectedChat?.id)}
              description="Are you sure want to delete this group?"
            />
          ) : null}

          <RemoveConfirmationModal
            isOpen={clearChatMessageIsOpen}
            toggle={closeSelectedChatToClearHandler}
            description="Are you sure want to clear chat?"
            isLoading={clearMessageIsLoading}
            onPress={() =>
              clearChatMessageHandler(
                selectedChat?.id,
                selectedChat?.pin_group ? "group" : "personal",
                toggleClearMessage
              )
            }
          />
        </>
      ) : null}
    </>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
