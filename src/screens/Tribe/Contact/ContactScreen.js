import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import _ from "lodash";

import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import Input from "../../../components/shared/Forms/Input";
import ContactList from "../../../components/Tribe/Contact/ContactList";

const ContactScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const fetchEmployeeContactParameters = {
    page: currentPage,
    search: searchInput,
    limit: 50,
  };

  const {
    data: employeeData,
    isFetching: employeeDataIsFetching,
    isLoading: employeeDataIsLoading,
    refetch: refetchEmployeeData,
  } = useFetch("/hr/employees", [currentPage, searchInput], fetchEmployeeContactParameters);

  /**
   * Handle fetch more employee contact
   */
  const fetchMoreEmployeeContact = () => {
    if (currentPage < employeeData?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Handle search contact
   */
  const searchContactHandler = useCallback(
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
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ ...styles.container }}>
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
                searchContactHandler(value);
                setInputToShow(value);
              }}
              placeHolder="Search contact"
              height={40}
            />
          </View>

          {/* Content here */}
          <ContactList
            data={contacts}
            filteredData={filteredDataArray}
            hasBeenScrolled={hasBeenScrolled}
            setHasBeenScrolled={setHasBeenScrolled}
            fetchMore={fetchMoreEmployeeContact}
            isFetching={employeeDataIsFetching}
            navigation={navigation}
            userSelector={userSelector}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  search: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#E8E9EB",
  },
});

export default ContactScreen;
