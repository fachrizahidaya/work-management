import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import Input from "../../../components/shared/Forms/Input";
import { useFetch } from "../../../hooks/useFetch";
import UserListItem from "../../../components/Chat/Forward/UserListItem";
import { TextProps } from "../../../components/shared/CustomStylings";

const ForwardScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);

  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();

  const userFetchParameters = {
    page: currentPage,
    search: searchKeyword,
    limit: 20,
  };

  const { data, isLoading } = useFetch("/chat/user", [currentPage, searchKeyword], userFetchParameters);

  /**
   * Function that runs when user scrolled to the bottom of FlastList
   * Fetches more user data by incrementing currentPage by 1
   */
  const fetchMoreData = () => {
    if (currentPage < data?.data?.last_page) {
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
    setFilteredDataArray([]);
  }, [searchKeyword]);

  useEffect(() => {
    if (data?.data?.data?.length) {
      if (!searchKeyword) {
        setCumulativeData((prevData) => [...prevData, ...data?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...data?.data?.data]);
        setCumulativeData([]);
      }
    }
  }, [data]);

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
          <PageHeader title="New Chat" onPress={() => navigation.goBack()} />
          <Text style={[{ fontSize: 12, marginLeft: 25 }, TextProps]}>{data?.data?.total} users</Text>
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

          <Text style={{ color: "#9E9E9E" }}>CONTACT</Text>

          <FlashList
            ListFooterComponent={isLoading && <ActivityIndicator />}
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
});
