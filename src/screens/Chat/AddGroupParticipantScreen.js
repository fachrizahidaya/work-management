import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import { useFetch } from "../../hooks/useFetch";
import Input from "../../components/shared/Forms/Input";
import PageHeader from "../../components/shared/PageHeader";
import UserListItem from "../../components/Chat/UserSelection/UserListItem";

const AddGroupParticipantScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);

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

  const addSelectedUserToArray = (user) => {
    setSelectedUsers((prevState) => {
      if (!prevState.find((val) => val.id === user.id)) {
        return [...prevState, { ...user, is_admin: 0 }];
      }
      return prevState;
    });
    setForceRerender((prev) => !prev);
  };

  const removeSelectedUserFromArray = (user) => {
    const newUserArray = selectedUsers.filter((val) => {
      return val.id !== user.id;
    });
    setSelectedUsers(newUserArray);
    setForceRerender((prev) => !prev);
  };

  const onPressAddHandler = () => {
    if (!selectedUsers.length) {
      Toast.show({
        type: "error",
        text1: "At least 1 user must be selected",
        position: "bottom",
      });
    } else {
      navigation.navigate("Group Form", {
        userArray: selectedUsers,
      });
    }
  };

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
            <PageHeader title="Add Group Participant" onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 12, marginLeft: 10 }}>Add participants</Text>
          </View>
        </View>

        <View style={{ flex: 1, gap: 15, paddingHorizontal: 20 }}>
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
            extraData={forceRerender}
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
                  id={item?.id}
                  image={item?.image}
                  name={item?.name}
                  userType={item?.user_type}
                  selectedUsers={selectedUsers}
                  multiSelect={true}
                  email={item?.email}
                  type="group"
                  active_member={1}
                  onPressAddHandler={addSelectedUserToArray}
                  onPressRemoveHandler={removeSelectedUserFromArray}
                  selectedGroupMembers={selectedUsers}
                />
              </View>
            )}
          />
        </View>
      </View>

      <Pressable
        style={{
          position: "absolute",
          right: 10,
          bottom: 30,
          padding: 15,
          borderRadius: 30,
          borderWidth: 3,
          borderColor: "#FFFFFF",
          backgroundColor: "#176688",
          shadowOffset: 0,
        }}
        onPress={onPressAddHandler}
      >
        <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
};

export default AddGroupParticipantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
