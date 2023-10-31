import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import _ from "lodash";

import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Flex, HStack, Icon, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../hooks/useFetch";
import { ErrorToast } from "../../components/shared/ToastDialog";
import PageHeader from "../../components/shared/PageHeader";
import UserListItem from "../../components/Chat/UserSelection/UserListItem";

const UserSelectionScreen = () => {
  const toast = useToast();
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
    limit: 10,
  };

  const { data, isLoading } = useFetch("/setting/users", [currentPage, searchKeyword], userFetchParameters);

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
    }, 1000),
    []
  );

  const addSelectedUserToArray = (user) => {
    setSelectedUsers((prevState) => {
      if (!prevState.find((val) => val.id === user.id)) {
        return [...prevState, user];
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
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="At least 1 user must be selected" close={() => toast.close(id)} />;
        },
      });
    } else {
      navigation.navigate("Group Form", { userArray: selectedUsers });
    }
  };

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
      <Flex flex={1}>
        <HStack alignItems="center" justifyContent="space-between" paddingHorizontal={16} paddingBottom={13}>
          <VStack>
            <PageHeader title="New Group" onPress={() => navigation.goBack()} />
            <Text fontSize={12} ml={9}>
              Add participants
            </Text>
          </VStack>

          <TouchableOpacity>
            <Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" />
          </TouchableOpacity>
        </HStack>

        <Box flex={1} paddingHorizontal={16}>
          <FlashList
            extraData={forceRerender}
            ListFooterComponent={isLoading && <Spinner size="lg" color="primary.600" />}
            estimatedItemSize={200}
            data={cumulativeData.length ? cumulativeData : filteredDataArray}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            onEndReached={fetchMoreData}
            renderItem={({ item }) => (
              <Box marginBottom={2}>
                <UserListItem
                  user={item}
                  id={item?.id}
                  image={item?.image}
                  name={item?.name}
                  userType={item?.user_type}
                  selectedUsers={selectedUsers}
                  onPressAddHandler={addSelectedUserToArray}
                  onPressRemoveHandler={removeSelectedUserFromArray}
                />
              </Box>
            )}
          />
        </Box>
      </Flex>

      <Pressable
        position="absolute"
        right={5}
        bottom={20}
        rounded="full"
        bgColor="primary.600"
        p={15}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={onPressAddHandler}
      >
        <Icon as={<MaterialCommunityIcons name="arrow-right" />} size="xl" color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

export default UserSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
