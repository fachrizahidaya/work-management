import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";

import { FlashList } from "@shopify/flash-list";
import { Box, Button, Icon, IconButton, Input, Modal, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import MemberListItem from "./MemberListItem";
import FormButton from "../../../shared/FormButton";

const AddMemberModal = ({ isOpen, onClose, onPressHandler }) => {
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
    }, 1000),
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
      isOpen={isOpen}
      onClose={() => {
        !loadingIndicator && onClose();
      }}
      size="xl"
    >
      <Modal.Content>
        <Modal.Header>New Member</Modal.Header>
        <Modal.Body>
          <Input
            value={inputToShow}
            placeholder="Search user..."
            size="md"
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
                  icon={<Icon as={<MaterialCommunityIcons name="close" />} color="#3F434A" />}
                  rounded="full"
                  size="sm"
                  mr={2}
                />
              )
            }
          />
          <Box flex={1} height={300} mt={4}>
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
                  onPressAddHandler={addSelectedUserToArray}
                  onPressRemoveHandler={removeSelectedUserFromArray}
                />
              )}
            />
          </Box>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <FormButton onPress={onClose} disabled={loadingIndicator} color="transparent" variant="outline">
              <Text>Cancel</Text>
            </FormButton>

            <FormButton
              onPress={(setIsLoading) => onPressHandler(selectedUsers, setIsLoading)}
              setLoadingIndicator={setLoadingIndicator}
            >
              <Text color="white">Submit</Text>
            </FormButton>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default AddMemberModal;
