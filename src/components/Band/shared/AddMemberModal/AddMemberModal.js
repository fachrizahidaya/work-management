import React, { useEffect, useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { Box, Modal } from "native-base";

import { useFetch } from "../../../../hooks/useFetch";
import MemberListItem from "./MemberListItem";

const AddMemberModal = ({ isOpen, onClose, onPressHandler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const userFetchParameters = {
    page: currentPage,
    limit: 10,
  };
  const { data, isLoading } = useFetch("/setting/users", [currentPage], userFetchParameters);

  /**
   * Function that runs when user scrolled to the bottom of FlastList
   * Fetches more user data by incrementing currentPage by 1
   */
  const fetchMoreData = () => {
    if (currentPage < data?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (data?.data?.data) {
      setUsers((prevData) => [...prevData, ...data?.data?.data]);
    }
  }, [data?.data?.data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>New Member</Modal.Header>
        <Modal.Body>
          <Box flex={1} height={180}>
            <FlashList
              estimatedItemSize={200}
              data={users}
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
