import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, Pressable } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import MenuHeader from "./MenuHeader";
import SearchBox from "./SearchBox";

const ChatHeader = ({
  name,
  image,
  position,
  email,
  fileAttachment,
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
  reference,
}) => {
  console.log("s", selectedGroupMembers);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");

  const navigation = useNavigation();

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
          padding: 15,
          borderBottomWidth: 1,
          borderColor: "#E8E9EB",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable onPress={() => !isLoading && navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={25} color="#3F434A" />
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("User Detail", {
                navigation: navigation,
                name: name,
                image: image,
                position: position,
                email: email,
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
            <AvatarPlaceholder name={name} image={image} size="md" />

            <View>
              <Text style={{ fontSize: 16 }}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>
              {type === "personal" ? (
                <Text style={{ fontSize: 12, fontWeight: "400" }}>{email}</Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "400",
                        width: 200,
                        overflow: "hidden",
                      }}
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
        <Pressable onPress={() => reference.current?.show()}>
          <MaterialIcons name="more-horiz" size={20} color="#000000" />
        </Pressable>

        <MenuHeader
          fileAttachment={fileAttachment}
          toggleDeleteGroupModal={toggleDeleteGroupModal}
          toggleDeleteModal={toggleDeleteModal}
          toggleExitModal={toggleExitModal}
          toggleSearch={toggleSearch}
          toggleClearChatMessage={toggleClearChatMessage}
          type={type}
          active_member={active_member}
          onUpdatePinHandler={onUpdatePinHandler}
          roomId={roomId}
          isPinned={isPinned}
          reference={reference}
        />
      </View>

      {searchVisible && (
        <SearchBox
          inputToShow={inputToShow}
          searchInput={searchInput}
          toggleSearch={toggleSearch}
          clearSearch={clearSearch}
          setInputToShow={setInputToShow}
          setSearchInput={setSearchInput}
        />
      )}
    </>
  );
};

export default ChatHeader;
