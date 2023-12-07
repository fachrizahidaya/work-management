import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Image, Input, Pressable, Skeleton, Spinner, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import ContactList from "../../components/Tribe/Contact/ContactList";

const ContactScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  // Paremeters for fetch contact
  const fetchEmployeeContactParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  const {
    data: employeeData,
    isFetching: employeeDataIsFetching,
    isLoading: employeeDataIsLoading,
    refetch: refetchEmployeeData,
  } = useFetch("/hr/employees", [currentPage, searchInput], fetchEmployeeContactParameters);

  /**
   * Fetch employee contact Handler
   */
  const fetchMoreEmployeeContact = () => {
    if (currentPage < employeeData?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Search contact name handler
   */
  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 1000),
    []
  );

  useEffect(() => {
    if (employeeData?.data?.data.length) {
      if (!searchInput) {
        setContacts((prevData) => [...prevData, ...employeeData?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...employeeData?.data?.data]);
        setContacts([]);
      }
    }
  }, [employeeData]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex
        borderBottomWidth={1}
        borderBottomColor="#E8E9EB"
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        bgColor="#FFFFFF"
        py={14}
        px={15}
      >
        <PageHeader title="Contact" backButton={false} />
      </Flex>

      <Box backgroundColor="#FFFFFF" py={4} px={3}>
        <Input
          value={inputToShow}
          InputLeftElement={
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
            </Pressable>
          }
          InputRightElement={
            inputToShow && (
              <Pressable
                onPress={() => {
                  setInputToShow("");
                  setSearchInput("");
                }}
              >
                <Icon as={<MaterialCommunityIcons name="close-circle-outline" />} size="md" mr={2} color="muted.400" />
              </Pressable>
            )
          }
          onChangeText={(value) => {
            handleSearch(value);
            setInputToShow(value);
          }}
          variant="unstyled"
          size="md"
          placeholder="Search contact"
          borderRadius={15}
          borderWidth={1}
          style={{ height: 40 }}
        />
      </Box>

      <Flex px={3} flex={1} flexDir="column">
        {/* Content here */}

        {/* If there are no data handler */}
        {employeeData?.data?.data.length === 0 ? (
          <VStack space={2} alignItems="center" justifyContent="center">
            <Image source={require("../../assets/vectors/empty.png")} resizeMode="contain" size="2xl" alt="empty" />
            <Text>No Data</Text>
          </VStack>
        ) : employeeDataIsFetching ? (
          <VStack alignItems="center" mt={5} space={2}>
            <Skeleton h={82} />
            <Skeleton h={82} />
            <Skeleton h={82} />
            <Skeleton h={82} />
            <Skeleton h={82} />
          </VStack>
        ) : (
          <FlashList
            data={contacts.length ? contacts : filteredDataArray}
            onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={20}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            estimatedItemSize={200}
            onEndReached={hasBeenScrolled ? fetchMoreEmployeeContact : null}
            ListFooterComponent={() =>
              employeeDataIsLoading && hasBeenScrolled && <Spinner color="primary.600" size="lg" />
            }
            renderItem={({ item }) => (
              <ContactList
                key={item?.id}
                id={item?.id}
                name={item?.name}
                position={item?.position_name}
                image={item?.image}
                phone={item?.phone_number}
                email={item?.email}
                user={item?.user}
                user_id={item?.user?.id}
                room_id={item?.chat_personal_id}
                user_name={item?.user?.name}
                user_type={item?.user?.user_type}
                user_image={item?.user?.image}
                loggedEmployeeId={userSelector?.user_role_id}
                refetch={refetchEmployeeData}
              />
            )}
          />
        )}
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
  },
});

export default ContactScreen;
