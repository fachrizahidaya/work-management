import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, StyleSheet } from "react-native";

import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../config/api";
import GlobalSearchInput from "../../components/Chat/GlobalSearchInput/GlobalSearchInput";
import GroupSection from "../../components/Chat/GroupSection/GroupSection";
import PersonalSection from "../../components/Chat/PersonalSection/PersonalSection";
import GlobalSearchChatSection from "../../components/Chat/GlobalSearchChatSection/GlobalSearchChatSection";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho } = useWebsocketContext();
  const [globalKeyword, setGlobalKeyword] = useState("");

  const { data: searchResult } = useFetch("/chat/global-search", [globalKeyword], { search: globalKeyword });

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GlobalSearchInput globalKeyword={globalKeyword} setGlobalKeyword={setGlobalKeyword} />

        <GroupSection groupChats={groupChats} searchKeyword={globalKeyword} searchResult={searchResult?.group} />

        <PersonalSection
          personalChats={personalChats}
          searchKeyword={globalKeyword}
          searchResult={searchResult?.personal}
        />

        {searchResult?.message?.length > 0 && (
          <GlobalSearchChatSection searchResult={searchResult} globalKeyword={globalKeyword} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
