import { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import _ from "lodash";

import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Spinner } from "native-base";
import { FlashList } from "@shopify/flash-list";

import { useFetch } from "../../hooks/useFetch";
import Input from "../../components/shared/Forms/Input";
import PageHeader from "../../components/shared/PageHeader";
import UserListItem from "../../components/Chat/UserSelection/UserListItem";

const AddPersonalChatScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);

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
        <View style={{ justifyContent: "space-between", paddingHorizontal: 20 }}>
          <View>
            <PageHeader title="Select User" onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 12, marginLeft: 10 }}>{data?.data?.total} users</Text>
          </View>
        </View>

        <View style={{ flex: 1, gap: 5, paddingHorizontal: 20 }}>
          <Input
            fieldName="search"
            value={inputToShow}
            placeHolder="Search user..."
            onChangeText={(value) => {
              searchHandler(value);
              setInputToShow(value);
            }}
            endIcon={inputToShow && "close"}
            onPressEndIcon={() => {
              setSearchKeyword("");
              setInputToShow("");
            }}
          />

          <FlashList
            ListFooterComponent={isLoading && <Spinner size="lg" color="primary.600" />}
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
                />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddPersonalChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
