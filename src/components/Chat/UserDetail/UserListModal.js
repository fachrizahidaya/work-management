import { useState } from "react";
import { useSelector } from "react-redux";

import { Box, Icon, Input, Modal, Pressable, Spinner, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";

import UserListItemModal from "./UserListItemModal";

const UserListModal = ({
  roomId,
  memberListIsopen,
  toggleMemberList,
  toggleAddMember,
  handleSearch,
  inputToShow,
  setInputToShow,
  setSearchInput,
  fetchMoreData,
  cumulativeData,
  filteredDataArray,
  userListIsLoading,
  onPressAddHandler,
  onPressRemoveHandler,
  selectedUsers,
  setSelectedUsers,
  forceRerender,
  onAddMoreMember,
  addMemberIsLoading,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const userSelector = useSelector((state) => state.auth);

  return (
    <Modal isOpen={memberListIsopen} onClose={toggleMemberList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose User</Modal.Header>
        <Modal.Body>
          <Input
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
          />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={cumulativeData.length ? cumulativeData : filteredDataArray}
              extraData={forceRerender}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReached={hasBeenScrolled ? fetchMoreData : null}
              onEndReachedThreshold={0.1}
              ListFooterComponent={userListIsLoading && <Spinner color="primary.600" />}
              renderItem={({ item }) => (
                <UserListItemModal
                  id={item?.id}
                  user={item}
                  name={item?.name}
                  userType={item?.user_type}
                  image={item?.image}
                  multiSelect={true}
                  type="group"
                  onPressAddHandler={onPressAddHandler}
                  onPressRemoveHandler={onPressRemoveHandler}
                  userSelector={userSelector}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                />
              )}
            />
          </Box>
          <Pressable
            position="absolute"
            right={5}
            bottom={10}
            rounded="full"
            bgColor="primary.600"
            p={15}
            shadow="0"
            borderRadius="full"
            borderWidth={3}
            borderColor="#FFFFFF"
            onPress={() => {
              onAddMoreMember(roomId, selectedUsers, toggleAddMember);
            }}
          >
            {addMemberIsLoading ? (
              <Spinner size="sm" color="#FFFFFF" />
            ) : (
              <Icon as={<MaterialCommunityIcons name="arrow-right" />} size="md" color="white" />
            )}
          </Pressable>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default UserListModal;
