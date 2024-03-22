import { useState } from "react";

import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SearchBox from "./SearchBox";
import { TextProps } from "../../shared/CustomStylings";
import ContactDescription from "./ContactDescription";

const ChatHeader = ({
  name,
  image,
  position,
  email,
  type,
  active_member,
  toggleExitModal,
  toggleDeleteGroupModal,
  selectedGroupMembers,
  loggedInUser,
  toggleDeleteModal,
  deleteModalIsOpen,
  deleteChatPersonal,
  roomId,
  deleteChatMessageIsLoading,
  isLoading,
  toggleDeleteChatMessage,
  onUpdatePinHandler,
  isPinned,
  navigation,
  searchMessage,
  setSearchMessage,
  searchFormRef,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);

  /**
   * Handle for member name in chatHeader
   */
  const membersName = selectedGroupMembers.map((item) => {
    const name = !item?.user
      ? loggedInUser === item?.id
        ? "You"
        : item?.name
      : loggedInUser === item?.user?.id
      ? "You"
      : item?.user?.name;
    return `${name}`;
  });
  const concatenatedNames = membersName.join(", ");

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const params = {
    name: name,
    image: image,
    position: position,
    type: type,
    roomId: roomId,
    loggedInUser: loggedInUser,
    active_member: active_member,
    toggleDeleteModal: toggleDeleteModal,
    deleteModalIsOpen: deleteModalIsOpen,
    deleteChatPersonal: deleteChatPersonal,
    deleteChatMessageIsLoading: deleteChatMessageIsLoading,
    toggleDeleteChatMessage: toggleDeleteChatMessage,
  };

  const renderHeaderOptions = () => (
    <View
      style={{
        display: "flex",
        gap: 21,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: -20,
      }}
    >
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        {/* <TouchableOpacity
                      onPress={() => {
                        toggleSearch();
                        SheetManager.hide("form-sheet");
                      }}
                    >
                      <Text style={[{ fontSize: 16 }, TextProps]}>Search</Text>
                    </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin");
            SheetManager.hide("form-sheet");
          }}
          style={{
            ...styles.content,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#FFFFFF",
          }}
        >
          <Text style={[{ fontSize: 16 }, TextProps]}>{isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}</Text>
        </TouchableOpacity>
        {type === "group" ? (
          <>
            {active_member === 1 ? (
              <TouchableOpacity
                onPress={async () => {
                  await SheetManager.hide("form-sheet");
                  toggleExitModal();
                }}
                style={{
                  ...styles.content,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#FFFFFF",
                }}
              >
                <Text style={[{ fontSize: 16 }, TextProps]}>Exit Group</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  await SheetManager.hide("form-sheet");
                  toggleDeleteGroupModal();
                }}
                style={{
                  ...styles.content,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#FFFFFF",
                }}
              >
                <Text style={[{ fontSize: 16 }, TextProps]}>Delete Group</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={async () => {
                await SheetManager.hide("form-sheet");
                toggleDeleteModal();
              }}
              style={{
                ...styles.content,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text style={[{ fontSize: 16 }, TextProps]}>Delete Chat</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <>
      <View
        style={{
          ...styles.container,
        }}
      >
        <ContactDescription
          name={name}
          image={image}
          email={email}
          isLoading={isLoading}
          navigation={navigation}
          params={params}
          concatenatedNames={concatenatedNames}
          type={type}
        />
        <Pressable
          style={{ marginRight: 1 }}
          onPress={() =>
            SheetManager.show("form-sheet", {
              payload: {
                children: renderHeaderOptions(),
              },
            })
          }
        >
          <MaterialIcons name="more-horiz" size={20} color="#3F434A" />
        </Pressable>
      </View>

      {/* Handle for search message */}
      {searchVisible && (
        <SearchBox
          toggleSearch={toggleSearch}
          searchMessage={searchMessage}
          setSearchMessage={setSearchMessage}
          searchFormRef={searchFormRef}
        />
      )}
    </>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
