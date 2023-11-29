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

const ChatListScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho } = useWebsocketContext();
  const [globalKeyword, setGlobalKeyword] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  const { data: searchResult } = useFetch("/chat/global-search", [globalKeyword], { search: globalKeyword });

  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

  const { isLoading: deleteChatMessageIsLoading, toggle: toggleDeleteChatMessage } = useLoading(false);
  const { isLoading: chatRoomIsLoading, toggle: toggleChatRoom } = useLoading(false);

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

  const openSelectedChatHandler = (chat) => {
    setSelectedChat(chat);
    toggleDeleteModal();
  };

  const closeSelectedChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteModal();
  };

  const openSelectedGroupChatHandler = (chat) => {
    setSelectedChat(chat);
    toggleDeleteGroupModal();
  };

  const closeSelectedGroupChatHandler = () => {
    setSelectedChat(null);
    toggleDeleteGroupModal();
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
      navigation.navigate("Chat List");
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <GlobalSearchInput globalKeyword={globalKeyword} setGlobalKeyword={setGlobalKeyword} />

          <GroupSection
            groupChats={groupChats}
            searchKeyword={globalKeyword}
            searchResult={searchResult?.group}
            toggleDeleteModal={openSelectedGroupChatHandler}
          />

          <PersonalSection
            personalChats={personalChats}
            searchKeyword={globalKeyword}
            searchResult={searchResult?.personal}
            toggleDeleteModal={openSelectedChatHandler}
          />

          {searchResult?.message?.length > 0 && (
            <GlobalSearchChatSection searchResult={searchResult} globalKeyword={globalKeyword} />
          )}
        </ScrollView>
      </SafeAreaView>
      <RemoveConfirmationModal
        isLoading={deleteChatMessageIsLoading}
        isOpen={deleteModalIsOpen}
        toggle={closeSelectedChatHandler}
        onPress={() => deleteChatPersonal(selectedChat?.id)}
        description="Are you sure want to delete this chat?"
      />
      {selectedChat?.pin_group ? (
        <RemoveConfirmationModal
          isLoading={chatRoomIsLoading}
          isOpen={deleteGroupModalIsOpen}
          toggle={closeSelectedGroupChatHandler}
          onPress={() => groupDeleteHandler(selectedChat?.id)}
          description="Are you sure want to delete this group?"
        />
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
