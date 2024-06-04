import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../hooks/useFetch";
import Input from "../../../components/shared/Forms/Input";
import PageHeader from "../../../components/shared/PageHeader";
import UserListItem from "../../../components/Chat/UserSelection/UserListItem";
import { TextProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import SelectedUserList from "../../../components/Chat/UserSelection/SelectedUserList";

const AddGroupParticipantScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);

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
      Toast.show("At least 1 user must be selected", SuccessToastProps);
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
        <View style={styles.header}>
          <View>
            <PageHeader title="Add Group Participant" onPress={() => navigation.goBack()} />
            <Text style={[{ fontSize: 12, marginLeft: 25 }, TextProps]}>Add participants</Text>
          </View>
        </View>

        <View style={{ flex: 1, gap: 15 }}>
          <View style={{ paddingHorizontal: 15 }}>
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
          </View>
          <View style={{ paddingHorizontal: 15 }}>
            <View style={styles.selectedList}>
              {selectedUsers?.length > 0 &&
                selectedUsers?.map((user, index) => {
                  return <SelectedUserList key={index} name={user?.name} id={user?.id} image={user?.image} />;
                })}
            </View>
            <Text style={{ color: "#9E9E9E" }}>CONTACT</Text>
          </View>

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
                  navigation={navigation}
                  userSelector={userSelector}
                />
              </View>
            )}
          />
        </View>
      </View>
      <Pressable style={styles.addButton} onPress={onPressAddHandler}>
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
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
  },
  addButton: {
    position: "absolute",
    right: 10,
    bottom: 30,
    padding: 15,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#176688",
    shadowOffset: 0,
  },
});
