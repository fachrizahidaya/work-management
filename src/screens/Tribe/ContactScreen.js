import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import _ from "lodash";

import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { Spinner } from "native-base";

import { useFetch } from "../../hooks/useFetch";
import Input from "../../components/shared/Forms/Input";
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

  const navigation = useNavigation();

  // Paremeters for fetch contact
  const fetchEmployeeContactParameters = {
    page: currentPage,
    search: searchInput,
    limit: 10,
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
    }, 300),
    []
  );

  useEffect(() => {
    setFilteredDataArray([]);
  }, [searchInput]);

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
      <View style={styles.header}>
        <PageHeader title="Contact" backButton={false} />
      </View>

      <View style={styles.search} backgroundColor="#FFFFFF" py={4} px={3}>
        <Input
          value={inputToShow}
          fieldName="search"
          startIcon="magnify"
          endIcon={inputToShow && "close-circle-outline"}
          onPressEndIcon={() => {
            setInputToShow("");
            setSearchInput("");
          }}
          onChangeText={(value) => {
            handleSearch(value);
            setInputToShow(value);
          }}
          placeHolder="Search contact"
          height={40}
        />
      </View>

      {/* Content here */}
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <FlatList
          data={contacts.length ? contacts : filteredDataArray}
          onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={60}
          onEndReached={hasBeenScrolled ? fetchMoreEmployeeContact : null}
          ListFooterComponent={() => employeeDataIsFetching && hasBeenScrolled && <Spinner />}
          renderItem={({ item, index }) => (
            <ContactList
              key={index}
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
              navigation={navigation}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  search: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});

export default ContactScreen;
