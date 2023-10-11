import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";

import { FlashList } from "@shopify/flash-list";
import { Box, Icon, IconButton, Input, Modal } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import MemberListItem from "./MemberListItem";

const AddMemberModal = ({ isOpen, onClose, onPressHandler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [cumulativeData, setCumulativeData] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);

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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
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
                  onPressHandler={onPressHandler}
                />
              )}
            />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default AddMemberModal;
