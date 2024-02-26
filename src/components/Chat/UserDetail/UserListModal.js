import { useState } from "react";
import { useSelector } from "react-redux";

import {
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import Modal from "react-native-modal";

import UserListItemModal from "./UserListItemModal";
import Input from "../../shared/Forms/Input";
import { TextProps } from "../../shared/CustomStylings";

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
  forceRerender,
  onAddMoreMember,
  addMemberIsLoading,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const userSelector = useSelector((state) => state.auth);

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );

  return (
    <Modal
      isVisible={memberListIsopen}
      onBackdropPress={toggleMemberList}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View
        style={{
          display: "flex",
          gap: 10,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text style={[{ fontSize: 12 }, TextProps]}>Choose User</Text>
        <Input
          value={inputToShow}
          placeHolder="Search here..."
          endIcon="close-circle-outline"
          onPressEndIcon={() => {
            setInputToShow("");
            setSearchInput("");
          }}
          onChangeText={(value) => {
            handleSearch(value);
            setInputToShow(value);
          }}
        />
        <View style={{ height: 300, marginTop: 5 }}>
          <FlashList
            data={cumulativeData.length ? cumulativeData : filteredDataArray}
            extraData={forceRerender}
            estimatedItemSize={100}
            keyExtractor={(item, index) => index}
            onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
            onEndReached={hasBeenScrolled ? fetchMoreData : null}
            onEndReachedThreshold={0.1}
            ListFooterComponent={userListIsLoading && <ActivityIndicator />}
            renderItem={({ item }) => (
              <UserListItemModal
                id={item?.id}
                user={item}
                name={item?.name}
                userType={item?.user_type}
                image={item?.image}
                multiSelect={true}
                onPressAddHandler={onPressAddHandler}
                onPressRemoveHandler={onPressRemoveHandler}
                userSelector={userSelector}
                selectedUsers={selectedUsers}
              />
            )}
          />
        </View>
        <Pressable
          style={{
            position: "absolute",
            right: 10,
            bottom: 20,
            backgroundColor: "#176688",
            borderRadius: 40,
            shadowOffset: 0,
            padding: 20,
            borderWidth: 3,
            borderColor: "#FFFFFF",
          }}
          onPress={() => {
            onAddMoreMember(roomId, selectedUsers, toggleAddMember);
          }}
        >
          {addMemberIsLoading ? (
            <ActivityIndicator />
          ) : (
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

export default UserListModal;
