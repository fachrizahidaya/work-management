import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, StyleSheet } from "react-native";
import { useToast } from "native-base";

import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../config/api";
import GlobalSearchInput from "../../components/Chat/GlobalSearchInput/GlobalSearchInput";
import GroupSection from "../../components/Chat/GroupSection/GroupSection";
import PersonalSection from "../../components/Chat/PersonalSection/PersonalSection";
import GlobalSearchChatSection from "../../components/Chat/GlobalSearchChatSection/GlobalSearchChatSection";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import RemoveConfirmationModal from "../../components/Chat/ChatHeader/RemoveConfirmationModal";
import ContactMenu from "../../components/Chat/ContactListItem/ContactMenu";
import ContactInformation from "../../components/Chat/ContactListItem/ContactInformation";
import ChatMenu from "../../components/Chat/ContactListItem/ChatMenu";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho } = useWebsocketContext();
  const [globalKeyword, setGlobalKeyword] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const swipeToReply = (contact) => {
    setSelectedContact(contact);
    toggleContactOption();
  };

  const { data: searchResult } = useFetch("/chat/global-search", [globalKeyword], { search: globalKeyword });

  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: contactOptionIsOpen, toggle: toggleContactOption } = useDisclosure(false);
  const { isOpen: chatOptionIsOpen, toggle: toggleChatOption } = useDisclosure(false);
  const { isOpen: clearChatMessageIsOpen, toggle: toggleClearChatMessage } = useDisclosure(false);
  const { isOpen: contactInformationIsOpen, toggle: toggleContactInformation } = useDisclosure(false);
  const { isOpen: optionIsOpen, toggle: toggleOption } = useDisclosure(false);
  const { isOpen: deleteModalChatIsOpen, toggle: toggleDeleteModalChat } = useDisclosure(false);
  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } = useDisclosure(false);

  const { isLoading: deleteChatMessageIsLoading, toggle: toggleDeleteChatMessage } = useLoading(false);
  const { isLoading: chatRoomIsLoading, toggle: toggleChatRoom } = useLoading(false);
  const { isLoading: clearMessageIsLoading, toggle: toggleClearMessage } = useLoading(false);

  /**
   * Event listener for new chats
   */
  const personalChatEvent = () => {
    laravelEcho.channel(`personal.list.${userSelector?.id}`).listen(".personal.list", (event) => {
      setPersonalChats(event.data);
    });
  };

  /**
   * Event listener for new group chats
   */
  const groupChatEvent = () => {
    laravelEcho.channel(`group.list.${userSelector.id}`).listen(".group.list", (event) => {
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
    }
  };

  const openSelectedChatHandler = () => {
    setSelectedChat(selectedContact);
    toggleDeleteModal();
  };

  const closeSelectedChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteModal();
  };

  const openSelectedChatToClearHandler = () => {
    setSelectedChat(selectedContact);
    toggleClearChatMessage();
  };

  const closeSelectedChatToClearHandler = () => {
    setSelectedChat(null);
    toggleClearChatMessage();
  };

  const openSelectedGroupChatHandler = () => {
    setSelectedChat(selectedContact);
    toggleDeleteGroupModal();
  };

  const closeSelectedGroupChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteGroupModal();
  };

  const openSelectedContactMenuHandler = (contact) => {
    setSelectedContact(contact);
    toggleContactOption();
  };

  const closeSelectedContactMenuHandler = () => {
    setSelectedContact(null);
    toggleContactOption();
  };

  const openContactInformationHandler = () => {
    setSelectedChat(selectedContact);
    toggleContactInformation();
  };

  const closeContactInformationHandler = () => {
    setSelectedChat(null);
    toggleContactInformation();
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
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Chat Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleDeleteChatMessage();
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

  const clearChatMessageHandler = async (id, type, itemName) => {
    try {
      toggleClearMessage();
      await axiosInstance.delete(`/chat/${type}/${id}/message/clear`);
      toggleClearMessage();
      toggleClearChatMessage();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Chat Cleared" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleClearMessage();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
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
  });

  return (
    <>
      {isReady ? (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <GlobalSearchInput globalKeyword={globalKeyword} setGlobalKeyword={setGlobalKeyword} />

            <GroupSection
              groupChats={groupChats}
              searchKeyword={globalKeyword}
              searchResult={searchResult?.group}
              toggleDeleteModal={openSelectedGroupChatHandler}
              toggleContactOption={openSelectedContactMenuHandler}
              toggleChatOption={toggleChatOption}
              onSwipeControl={swipeToReply}
            />

            <PersonalSection
              personalChats={personalChats}
              searchKeyword={globalKeyword}
              searchResult={searchResult?.personal}
              toggleDeleteModal={openSelectedChatHandler}
              toggleContactOption={openSelectedContactMenuHandler}
              toggleChatOption={toggleChatOption}
              onSwipeControl={swipeToReply}
            />

            {searchResult?.message?.length > 0 && (
              <GlobalSearchChatSection searchResult={searchResult} globalKeyword={globalKeyword} />
            )}
          </ScrollView>
        </SafeAreaView>
      ) : null}
      <ContactMenu
        isOpen={contactOptionIsOpen}
        onClose={closeSelectedContactMenuHandler}
        chat={selectedContact}
        toggleDeleteModal={openSelectedChatHandler}
        toggleDeleteGroupModal={openSelectedGroupChatHandler}
        toggleClearChatMessage={openSelectedChatToClearHandler}
        toggleContactInformation={openContactInformationHandler}
        loggedInUser={userSelector?.id}
        toggleDeleteChatMessage={toggleDeleteChatMessage}
        toggleExitModal={toggleExitModal}
        deleteModalIsOpen={deleteModalIsOpen}
        exitModalIsOpen={exitModalIsOpen}
        deleteGroupModalIsOpen={deleteGroupModalIsOpen}
        deleteChatPersonal={deleteChatPersonal}
        deleteChatMessageIsLoading={deleteChatMessageIsLoading}
        chatRoomIsLoading={chatRoomIsLoading}
      />
      <ChatMenu isOpen={chatOptionIsOpen} onClose={toggleChatOption} />
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
          clearChatMessageHandler(selectedChat?.id, selectedChat?.pin_group ? "group" : "personal", toggleClearMessage)
        }
      />
      <ContactInformation
        isOpen={contactInformationIsOpen}
        toggle={closeContactInformationHandler}
        userId={selectedChat?.user?.id}
        name={selectedChat?.pin_group ? selectedChat?.name : selectedChat?.user?.name}
        roomId={selectedChat?.id}
        file_path={selectedChat?.pin_group ? selectedChat?.image : selectedChat?.user?.image}
        position={selectedChat?.user?.user_type}
        email={selectedChat?.user?.email}
        type={selectedChat?.pin_personal ? "personal" : "group"}
        active_member={!selectedChat?.active_member ? null : selectedChat?.active_member}
        isPinned={selectedChat?.pin_personal ? selectedChat?.pin_personal : selectedChat?.pin_group}
      />
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
