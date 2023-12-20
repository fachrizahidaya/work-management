import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";

import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import MemberListItem from "./MemberListItem";
import FormButton from "../../../shared/FormButton";
import Input from "../../../shared/Forms/Input";

const AddMemberModal = ({ isOpen, onClose, onPressHandler, multiSelect = true, header }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const userFetchParameters = {
    page: currentPage,
    search: searchKeyword,
    limit: 10,
  };

  const { data } = useFetch("/setting/users", [currentPage, searchKeyword], userFetchParameters);

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

  const addSelectedUserToArray = (userId) => {
    setSelectedUsers((prevState) => {
      if (!prevState.includes(userId)) {
        return [...prevState, userId];
      }
      return prevState;
    });
    setForceRerender((prev) => !prev);
  };

  const removeSelectedUserFromArray = (userId) => {
    const newUserArray = selectedUsers.filter((user) => {
      return user !== userId;
    });
    setSelectedUsers(newUserArray);
    setForceRerender((prev) => !prev);
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
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => {
        !loadingIndicator && onClose();
      }}
    >
      <View
        style={{ borderWidth: 1, display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{header}</Text>
        </View>
        <View>
          <Input
            value={inputToShow}
            placeHolder="Search user..."
            size="md"
            onChangeText={(value) => {
              searchHandler(value);
              setInputToShow(value);
            }}
            endAdornment={
              inputToShow && (
                <Pressable
                  onPress={() => {
                    setSearchKeyword("");
                    setInputToShow("");
                  }}
                >
                  <MaterialCommunityIcons name="close" size={20} />
                </Pressable>
              )
            }
          />
          <View style={{ height: 300, marginTop: 4 }}>
            <FlashList
              extraData={forceRerender}
              estimatedItemSize={200}
              data={cumulativeData.length ? cumulativeData : filteredDataArray}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              onEndReached={fetchMoreData}
              renderItem={({ item }) => (
                <MemberListItem
                  id={item?.id}
                  image={item?.image}
                  name={item?.name}
                  userType={item?.user_type}
                  selectedUsers={selectedUsers}
                  multiSelect={multiSelect}
                  onPressAddHandler={addSelectedUserToArray}
                  onPressRemoveHandler={removeSelectedUserFromArray}
                  onPressHandler={onPressHandler}
                />
              )}
            />
          </View>
        </View>

        {multiSelect && (
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <FormButton onPress={onClose} disabled={loadingIndicator} color="transparent" variant="outline">
              <Text>Cancel</Text>
            </FormButton>

            <FormButton
              onPress={(setIsLoading) => onPressHandler(selectedUsers, setIsLoading)}
              setLoadingIndicator={setLoadingIndicator}
            >
              <Text style={{ color: "white", fontWeight: 500 }}>Submit</Text>
            </FormButton>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default AddMemberModal;
