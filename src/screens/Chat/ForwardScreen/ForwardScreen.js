import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import _ from "lodash";

import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import Input from "../../../components/shared/Forms/Input";
import { useFetch } from "../../../hooks/useFetch";
import UserListItem from "../../../components/Chat/Forward/UserListItem";
import { ErrorToastProps, TextProps } from "../../../components/shared/CustomStylings";
import axiosInstance from "../../../config/api";
import PersonalSection from "../../../components/Chat/Forward/PersonalSection";
import GroupSection from "../../../components/Chat/Forward/GroupSection";

const ForwardScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);

  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();

  const route = useRoute();

  const { message, project, task, file_path, file_name, file_size, mime_type } = route.params;

  const userFetchParameters = {
    page: currentPage,
    search: searchKeyword,
    limit: 20,
  };

  const { data: personalChat, isLoading: personalChatIsLoading } = useFetch("/chat/personal");
  const { data: groupChat, isLoading: groupChatIsLoading } = useFetch("/chat/group");
  const { data: contact, isLoading: contactIsLoading } = useFetch(
    "/chat/user",
    [currentPage, searchKeyword],
    userFetchParameters
  );

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

  /**
   * Function that runs when user scrolled to the bottom of FlastList
   * Fetches more user data by incrementing currentPage by 1
   */
  const fetchMoreData = () => {
    if (currentPage < contact?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchHandler = useCallback(
    _.debounce((value) => {
      setSearchKeyword(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchPersonalChats();
    fetchGroupChats();
  }, []);

  useEffect(() => {
    setFilteredDataArray([]);
  }, [searchKeyword]);

  useEffect(() => {
    if (contact?.data?.data?.length) {
      if (!searchKeyword) {
        setCumulativeData((prevData) => [...prevData, ...contact?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...contact?.data?.data]);
        setCumulativeData([]);
      }
    }
  }, [contact]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <View
          style={{
            justifyContent: "space-between",
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <PageHeader title="Send to" onPress={() => navigation.goBack()} />
        </View>

        <View style={{ flex: 1, gap: 15, paddingHorizontal: 16 }}>
          <Input
            fieldName="search"
            value={inputToShow}
            placeHolder="Search..."
            onChangeText={(value) => {
              searchHandler(value);
              setInputToShow(value);
            }}
            startIcon="magnify"
            endIcon={inputToShow && "close"}
            onPressEndIcon={() => {
              setSearchKeyword("");
              setInputToShow("");
            }}
          />

          <GroupSection
            groupChats={groupChat?.data}
            navigation={navigation}
            message={message}
            project={project}
            task={task}
            file_path={file_path}
            file_name={file_name}
            file_size={file_size}
            mime_type={mime_type}
          />

          <PersonalSection
            personalChats={personalChat?.data}
            navigation={navigation}
            message={message}
            project={project}
            task={task}
            file_path={file_path}
            file_name={file_name}
            file_size={file_size}
            mime_type={mime_type}
          />

          <View style={styles.header}>
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>PEOPLE</Text>
          </View>

          <FlashList
            ListFooterComponent={contactIsLoading && <ActivityIndicator />}
            estimatedItemSize={200}
            data={cumulativeData.length ? cumulativeData : filteredDataArray}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            onEndReached={fetchMoreData}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <UserListItem
                  user={item}
                  roomId={item?.chat_personal_id}
                  id={item?.id}
                  image={item?.image}
                  name={item?.name}
                  userType={item?.user_type}
                  multiSelect={false}
                  email={item?.email}
                  type="personal"
                  active_member={0}
                  navigation={navigation}
                  userSelector={userSelector}
                  message={message}
                  project={project}
                  task={task}
                  file_path={file_path}
                  file_name={file_name}
                  file_size={file_size}
                  mime_type={mime_type}
                />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForwardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
