import { useState } from "react";

import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import SearchBox from "./SearchBox";
import { TextProps } from "../../shared/CustomStylings";

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
  toggleClearChatMessage,
  deleteModalIsOpen,
  exitModalIsOpen,
  deleteGroupModalIsOpen,
  deleteChatPersonal,
  roomId,
  deleteChatMessageIsLoading,
  chatRoomIsLoading,
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
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");

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

  const clearSearch = () => {
    setInputToShow("");
    setSearchInput("");
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          padding: 20,
          borderBottomWidth: 1,
          borderColor: "#E8E9EB",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable onPress={() => !isLoading && navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("User Detail", {
                name: name,
                image: image,
                position: position,
                type: type,
                roomId: roomId,
                loggedInUser: loggedInUser,
                active_member: active_member,
                toggleDeleteModal: toggleDeleteModal,
                toggleExitModal: toggleExitModal,
                toggleDeleteGroupModal: toggleDeleteGroupModal,
                deleteModalIsOpen: deleteModalIsOpen,
                exitModalIsOpen: exitModalIsOpen,
                deleteGroupModalIsOpen: deleteGroupModalIsOpen,
                deleteChatPersonal: deleteChatPersonal,
                deleteChatMessageIsLoading: deleteChatMessageIsLoading,
                chatRoomIsLoading: chatRoomIsLoading,
                toggleDeleteChatMessage: toggleDeleteChatMessage,
                toggleClearChatMessage: toggleClearChatMessage,
              })
            }
            style={{ display: "flex", flexDirection: "row", gap: 10 }}
          >
            <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />

            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>
              {type === "personal" ? (
                <Text style={[{ fontSize: 12 }, TextProps]}>{email}</Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        {
                          fontSize: 10,

                          width: 200,
                          overflow: "hidden",
                        },
                        TextProps,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {concatenatedNames}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        <Pressable
          style={{ marginRight: 1 }}
          onPress={() =>
            SheetManager.show("form-sheet", {
              payload: {
                children: (
                  <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                    {/* <TouchableOpacity
                      onPress={() => {
                        toggleSearch();
                        SheetManager.hide("form-sheet");
                      }}
                    >
                      <Text style={[{ fontSize: 14 }, TextProps]}>Search</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => {
                        onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin");
                        SheetManager.hide("form-sheet");
                      }}
                    >
                      <Text style={[{ fontSize: 14 }, TextProps]}>
                        {isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}
                      </Text>
                    </TouchableOpacity>
                    {type === "group" ? (
                      <>
                        {active_member === 1 ? (
                          <TouchableOpacity
                            onPress={async () => {
                              await SheetManager.hide("form-sheet");
                              toggleExitModal();
                            }}
                          >
                            <Text style={[{ fontSize: 14 }, TextProps]}>Exit Group</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={async () => {
                              await SheetManager.hide("form-sheet");
                              toggleDeleteGroupModal();
                            }}
                          >
                            <Text style={[{ fontSize: 14 }, TextProps]}>Delete Group</Text>
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
                        >
                          <Text style={[{ fontSize: 14 }, TextProps]}>Delete Chat</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ),
              },
            })
          }
        >
          <MaterialIcons name="more-horiz" size={20} color="#3F434A" />
        </Pressable>
      </View>

      {searchVisible && (
        <SearchBox
          inputToShow={inputToShow}
          searchInput={searchInput}
          toggleSearch={toggleSearch}
          clearSearch={clearSearch}
          setInputToShow={setInputToShow}
          setSearchInput={setSearchInput}
          searchMessage={searchMessage}
          setSearchMessage={setSearchMessage}
          searchFormRef={searchFormRef}
        />
      )}
    </>
  );
};

export default ChatHeader;
