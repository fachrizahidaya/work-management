import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Image, Input, Pressable, Skeleton, Spinner, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ContactList from "../../components/Tribe/Contact/ContactList";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";

const ContactScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  const dependencies = [currentPage, searchInput];
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
  } = useFetch("/hr/employees", dependencies, fetchEmployeeContactParameters);

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
        <FlashList
          data={contacts.length ? contacts : filteredDataArray}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          onEndReached={fetchMoreEmployeeContact}
          // ListFooterComponent={employeeDataIsFetching && <Spinner color="primary.600" size="sm" />}
          renderItem={({ item }) => (
            <ContactList
              key={item?.id}
              id={item?.id}
              name={item?.name}
              position={item?.position_name}
              division={item?.division_name}
              status={item?.status}
              image={item?.image}
              phone={item?.phone_number}
              email={item?.email}
              refetch={refetchEmployeeData}
              loggedEmployeeId={userSelector?.user_role_id}
            />
          )}
        />

        <>
          {/* If there are no data handler */}
          {employeeData?.data?.data.length === 0 && (
            <VStack space={2} alignItems="center" justifyContent="center">
              <Image source={require("../../assets/vectors/empty.png")} resizeMode="contain" size="2xl" alt="empty" />
              <Text>No Data</Text>
            </VStack>
          )}
        </>
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
