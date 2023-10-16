import { useState, useRef, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import { useFormik } from "formik";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Image, Input, Pressable, Skeleton, Text, VStack } from "native-base";
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
  const [isGridView, setIsGridView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handler for search input
  const firstTimeRef = useRef(true);
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

  const fetchMoreEmployeeContact = () => {
    if (currentPage < employeeData?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      search: "",
    },
  });

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      if (value === "") {
        setCurrentPage(1);
      }
    }, 500),
    []
  );

  const toggleView = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGridView(!isGridView);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (searchInput) {
      if (employeeData?.data?.data) {
        const filteredData = employeeData?.data?.data.filter((item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setContacts(filteredData);
      }
    } else {
      if (employeeData?.data?.data) {
        setContacts((prevData) => [...prevData, ...employeeData?.data?.data]);
      }
    }
  }, [employeeData?.data?.data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetchEmployeeData();
    }, [refetchEmployeeData])
  );

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
          value={formik.values.search}
          variant="unstyled"
          size="md"
          InputLeftElement={
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
            </Pressable>
          }
          InputRightElement={
            searchInput && (
              <Pressable
                onPress={() => {
                  handleSearch("");
                  formik.resetForm();
                }}
              >
                <Icon as={<MaterialCommunityIcons name="close-circle-outline" />} size="md" mr={2} color="muted.400" />
              </Pressable>
            )
          }
          placeholder="Search contact"
          borderRadius={15}
          borderWidth={1}
          style={{ height: 40 }}
          onChangeText={(value) => {
            handleSearch(value);
            formik.setFieldValue("search", value);
          }}
        />
      </Box>

      {isLoading ? (
        <VStack mt={3} px={3} space={2}>
          <Skeleton h={60} />
          <Skeleton h={60} />
          <Skeleton h={60} />
          <Skeleton h={60} />
          <Skeleton h={60} />
          <Skeleton h={60} />
        </VStack>
      ) : (
        <Flex px={3} flex={1} flexDir="column">
          {/* Content here */}
          {employeeData?.data?.data.length > 0 ? (
            <FlashList
              data={contacts}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              estimatedItemSize={200}
              onEndReached={fetchMoreEmployeeContact}
              refreshControl={<RefreshControl refreshing={employeeDataIsFetching} onRefresh={refetchEmployeeData} />}
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
                />
              )}
            />
          ) : (
            <VStack space={2} alignItems="center" justifyContent="center">
              <Image source={require("../../assets/vectors/empty.png")} resizeMode="contain" size="2xl" alt="empty" />
              <Text>No Data</Text>
            </VStack>
          )}
        </Flex>
      )}
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
