import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useFetch } from "../../hooks/useFetch";
import Input from "../../components/shared/Forms/Input";
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
        <View style={{ flexDirection: "row", gap: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Contact</Text>
        </View>
      </View>

      <View style={styles.search} backgroundColor="#FFFFFF">
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
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <FlashList
          data={contacts.length ? contacts : filteredDataArray}
          onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={60}
          onEndReached={hasBeenScrolled ? fetchMoreEmployeeContact : null}
          ListFooterComponent={() => employeeDataIsFetching && hasBeenScrolled && <ActivityIndicator />}
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  search: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#E8E9EB",
  },
});

export default ContactScreen;
