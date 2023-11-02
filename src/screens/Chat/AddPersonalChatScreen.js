import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import _ from "lodash";

import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Flex, HStack, Icon, IconButton, Input, Spinner, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import UserListItem from "../../components/Chat/UserSelection/UserListItem";

const AddPersonalChatScreen = () => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const [searchModeIsOn, setSearchModeIsOn] = useState(false);
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
      <Flex flex={1} position="relative">
        <HStack alignItems="center" justifyContent="space-between" paddingHorizontal={16} paddingBottom={13}>
          <VStack>
            <PageHeader title="Select User" onPress={() => navigation.goBack()} />
            <Text fontSize={12} ml={9}>
              {data?.data?.total - 1} users
            </Text>
          </VStack>

          <TouchableOpacity onPress={() => setSearchModeIsOn(!searchModeIsOn)}>
            <Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" />
          </TouchableOpacity>

          {searchModeIsOn && (
            <Box
              position="absolute"
              top={0}
              bgColor="white"
              width={width}
              h={50}
              zIndex={1}
              alignItems="center"
              paddingHorizontal={16}
            >
              <Input
                autoFocus
                flex={1}
                value={inputToShow}
                placeholder="Search user..."
                size="lg"
                onChangeText={(value) => {
                  searchHandler(value);
                  setInputToShow(value);
                }}
                InputLeftElement={
                  <IconButton
                    onPress={() => {
                      setSearchModeIsOn(!searchModeIsOn);
                      setSearchKeyword("");
                      setInputToShow("");
                    }}
                    ml={2}
                    mb={1}
                    rounded="full"
                  >
                    <Icon as={<MaterialCommunityIcons name="arrow-left" />} size="lg" />
                  </IconButton>
                }
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
            </Box>
          )}
        </HStack>

        <Box flex={1} paddingHorizontal={16}>
          <FlashList
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
                  multiSelect={false}
                />
              </Box>
            )}
          />
        </Box>
      </Flex>
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
