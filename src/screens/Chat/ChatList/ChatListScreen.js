import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import { SheetManager } from "react-native-actions-sheet";

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
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import PageHeader from "../../../components/shared/PageHeader";
import {
  clearChatMessageHandler,
  deleteChatPersonal,
  groupDeleteHandler,
  pinChatHandler,
} from "../../../components/Chat/shared/functions";

const ChatListScreen = () => {
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho } = useWebsocketContext();
  const [globalKeyword, setGlobalKeyword] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);

  const searchFromRef = useRef(null);
  const scrollRef = useRef(null);

  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: clearChatMessageModalIsOpen, toggle: toggleClearChatMessageModal } = useDisclosure(false);
  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } = useDisclosure(false);

  const { isLoading: deleteChatMessageIsLoading, toggle: toggleDeleteChatMessage } = useLoading(false);
  const { isLoading: deleteGroupIsLoading, toggle: toggleDeleteGroup } = useLoading(false);
  const { isLoading: clearChatMessageIsLoading, toggle: toggleClearChatMessage } = useLoading(false);

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

  const userFetchParameters = {
    page: currentPage,
    limit: 1000,
  };

  const { data: searchResult } = useFetch("/chat/global-search", [globalKeyword], { search: globalKeyword });
  const { data: user } = useFetch("/chat/user", [currentPage], userFetchParameters);

  /**
   * Handle for mention name in group member
   */
  const memberName = user?.data?.data.map((item) => {
    return item?.name;
  });

  /**
   * Handle select message to open contact menu
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
   * Handle clear chat message
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
   * Handle delete group chat
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
   * Handle open contact menu
   * @param {*} contact
   */
  const contactMenuHandler = (contact) => {
    SheetManager.show("form-sheet", {
      payload: {
        children: (
          <ContactMenu
            contact={contact}
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
            chatRoomIsLoading={deleteGroupIsLoading}
            navigation={navigation}
          />
        ),
      },
    });
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
                handleClickMore={contactMenuHandler}
                onPinControl={pinChatHandler}
                navigation={navigation}
                userSelector={userSelector}
              />

              <PersonalSection
                personalChats={personalChats}
                searchKeyword={globalKeyword}
                searchResult={searchResult?.personal}
                handleClickMore={contactMenuHandler}
                onPinControl={pinChatHandler}
                navigation={navigation}
                userSelector={userSelector}
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
              onPress={() => deleteChatPersonal(selectedChat?.id, toggleDeleteChatMessage, toggleDeleteModal)}
              description="Are you sure want to delete this chat?"
            />
          ) : null}
          {selectedChat?.pin_group ? (
            <RemoveConfirmationModal
              isLoading={deleteGroupIsLoading}
              isOpen={deleteGroupModalIsOpen}
              toggle={closeSelectedGroupChatHandler}
              onPress={() => groupDeleteHandler(selectedChat?.id, toggleDeleteGroup, toggleDeleteGroupModal)}
              description="Are you sure want to delete this group?"
            />
          ) : null}

          <RemoveConfirmationModal
            isOpen={clearChatMessageModalIsOpen}
            toggle={closeSelectedChatToClearHandler}
            description="Are you sure want to clear chat?"
            isLoading={clearChatMessageIsLoading}
            onPress={() =>
              clearChatMessageHandler(
                selectedChat?.id,
                selectedChat?.pin_group ? "group" : "personal",
                toggleClearChatMessage,
                toggleClearChatMessageModal
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
