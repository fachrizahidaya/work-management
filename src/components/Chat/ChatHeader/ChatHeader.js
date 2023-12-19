import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Flex, Icon, Pressable, Text } from "native-base";

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
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");

  const navigation = useNavigation();

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const clearSearch = () => {
    setInputToShow("");
    setSearchInput("");
  };

  return (
    <>
      <Flex direction="row" justifyContent="space-between" bg="white" borderBottomWidth={1} borderColor="#E8E9EB" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => !isLoading && navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
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
            display="flex"
            gap={4}
            flexDirection="row"
          >
            <AvatarPlaceholder name={name} image={image} size="md" />

            <Flex>
              <Text fontSize={16}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>
              {type === "personal" ? (
                <Text fontSize={12} fontWeight={400}>
                  {email}
                </Text>
              ) : (
                <Flex alignItems="center" flexDirection="row">
                  <Flex flexDirection="row" overflow="hidden" width={200} flexWrap="nowrap">
                    {selectedGroupMembers?.map((member, index) => {
                      return (
                        <Text key={index} fontSize={10} fontWeight={400} numberOfLines={1}>
                          {!member?.user
                            ? loggedInUser === member?.id
                              ? "You"
                              : member?.name
                            : loggedInUser === member?.user?.id
                            ? "You"
                            : member?.user?.name}
                          {index < selectedGroupMembers.length - 1 && `${", "}`}
                        </Text>
                      );
                    })}
                  </Flex>
                  {/* Handle if members overflow the flex size */}
                  {selectedGroupMembers.length > 2 ? (
                    <Text fontSize={10} fontWeight={400} numberOfLines={1}>
                      ...
                    </Text>
                  ) : null}
                </Flex>
              )}
            </Flex>
          </Pressable>
        </Flex>

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
        />
      </Flex>

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
