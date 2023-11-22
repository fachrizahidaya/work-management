import React, { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import _ from "lodash";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, HStack, Icon, IconButton, Input, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../hooks/useFetch";
import { ErrorToast } from "../../components/shared/ToastDialog";
import PageHeader from "../../components/shared/PageHeader";
import UserListItem from "../../components/Chat/UserSelection/UserListItem";

const AddGroupParticipantScreen = () => {
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
    limit: 20,
  };

  const route = useRoute();

  const { data, isLoading } = useFetch("/setting/users", [currentPage, searchKeyword], userFetchParameters);

  const { forceRender, setForceRender } = route.params;

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
      navigation.navigate("Group Form", {
        userArray: selectedUsers,
        forceRender: forceRender,
        setForceRender: setForceRender,
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
      <Flex flex={1} gap={2}>
        <HStack alignItems="center" justifyContent="space-between" paddingHorizontal={16}>
          <VStack>
            <PageHeader title="New Group" onPress={() => navigation.goBack()} />
            <Text fontSize={12} ml={9}>
              Add participants
            </Text>
          </VStack>
        </HStack>

        <VStack flex={1} paddingHorizontal={16} space={2}>
          <Input
            autoFocus
            value={inputToShow}
            placeholder="Search user..."
            size="lg"
            onChangeText={(value) => {
              searchHandler(value);
              setInputToShow(value);
            }}
            InputRightElement={
              inputToShow && (
                <IconButton
                  onPress={() => {
                    setSearchKeyword("");
                    setInputToShow("");
                  }}
                  icon={<Icon as={<MaterialCommunityIcons name="close" />} size="lg" />}
                  rounded="full"
                  mr={2}
                />
              )
            }
          />
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
                  multiSelect={true}
                  email={item?.email}
                  type="group"
                  active_member={1}
                  setForceRender={setForceRerender}
                  forceRender={forceRerender}
                  onPressAddHandler={addSelectedUserToArray}
                  onPressRemoveHandler={removeSelectedUserFromArray}
                  selectedGroupMembers={selectedUsers}
                />
              </Box>
            )}
          />
        </VStack>
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

export default AddGroupParticipantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
