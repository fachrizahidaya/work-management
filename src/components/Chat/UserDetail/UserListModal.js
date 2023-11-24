import { Box, Flex, Icon, Input, Modal, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import React, { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";

const UserListModal = ({
  memberListIsopen,
  toggleMemberList,
  handleSearch,
  inputToShow,
  setInputToShow,
  setSearchInput,
  userList,
  hasBeenScrolled,
  setHasBeenScrolled,
}) => {
  return (
    <Modal isOpen={memberListIsopen} onClose={toggleMemberList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose User</Modal.Header>
        <Modal.Body>
          {/* <Input
            value={inputToShow}
            placeholder="Search here..."
            InputRightElement={
              inputToShow && (
                <Pressable
                  onPress={() => {
                    setInputToShow("");
                    setSearchInput("");
                  }}
                >
                  <Icon
                    as={<MaterialCommunityIcons name="close-circle-outline" />}
                    size="md"
                    mr={2}
                    color="muted.400"
                  />
                </Pressable>
              )
            }
            onChangeText={(value) => {
              handleSearch(value);
              setInputToShow(value);
            }}
          /> */}
          {/* <Box flex={1} height={300} mt={4}>
            <FlashList
              data={userList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex my={1} gap={2} flexDirection="row">
                  <Flex
                    rounded="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="#f1f1f1"
                    padding={1}
                  >
                    <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />} size={5} />
                  </Flex>
                  <TouchableOpacity onPress={() => selectTaskHandler(item)}>
                    <Text fontSize={14} fontWeight={400} color="#000000">
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="#b2b2b2">
                      #{item?.task_no}
                    </Text>
                  </TouchableOpacity>
                </Flex>
              )}
            />
          </Box> */}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default UserListModal;
