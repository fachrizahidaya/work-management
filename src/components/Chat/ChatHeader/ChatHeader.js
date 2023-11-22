import { useState } from "react";

import { Box, Flex, Icon, Input, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";
import ReturnConfirmationModal from "../../shared/ReturnConfirmationModal";
import MenuHeader from "./MenuHeader";
import RemoveConfirmationModal from "./RemoveConfirmationModal";

const ChatHeader = ({
  navigation,
  name,
  image,
  position,
  email,
  userId,
  fileAttachment,
  type,
  active_member,
  groupExitHandler,
  groupDeleteHandler,
  exitModalIsOpen,
  deleteGroupModalIsOpen,
  toggleExitModal,
  toggleDeleteGroupModal,
  selectedGroupMembers,
  loggedInUser,
  deleteChatPersonal,
  toggleDeleteModal,
  deleteModalIsOpen,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          <Pressable onPress={() => navigation.navigate("Chat List")}>
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
                selectedGroupMembers: selectedGroupMembers,
              })
            }
            display="flex"
            gap={4}
            flexDirection="row"
          >
            <AvatarPlaceholder name={name} image={image} size="md" />

            <Box>
              <Text fontSize={16}>{name}</Text>
              {type === "personal" ? (
                <Text fontSize={12} fontWeight={400}>
                  {position}
                </Text>
              ) : (
                <Flex flexDirection="row" overflow="hidden" width={200} flexWrap="nowrap">
                  {selectedGroupMembers?.map((member, index) => {
                    return (
                      <Text fontSize={10} fontWeight={400} numberOfLines={1}>
                        {loggedInUser === member?.user?.id ? "You" : member?.user?.name}
                        {index < selectedGroupMembers.length - 1 && `${", "}`}
                      </Text>
                    );
                  })}
                </Flex>
              )}
            </Box>
          </Pressable>
        </Flex>

        <MenuHeader
          fileAttachment={fileAttachment}
          toggleDeleteGroupModal={toggleDeleteGroupModal}
          toggleDeleteModal={toggleDeleteModal}
          toggleExitModal={toggleExitModal}
          toggleSearch={toggleSearch}
          type={type}
          active_member={active_member}
        />

        {type === "group" && active_member === 1 && (
          <>
            <RemoveConfirmationModal
              isOpen={exitModalIsOpen}
              toggle={toggleExitModal}
              description="Are you sure want to exit this group?"
              onPress={() => groupExitHandler(userId, setIsLoading)}
              isLoading={isLoading}
            />
          </>
        )}

        {type === "group" && active_member === 0 && (
          <>
            <RemoveConfirmationModal
              isOpen={deleteGroupModalIsOpen}
              toggle={toggleDeleteGroupModal}
              description="Are you sure want to delete this group?"
              onPress={() => groupDeleteHandler(userId, setIsLoading)}
              isLoading={isLoading}
            />
          </>
        )}

        <RemoveConfirmationModal
          isOpen={deleteModalIsOpen}
          toggle={toggleDeleteModal}
          description="Are you sure want to delete this chat?"
          onPress={() => deleteChatPersonal(userId, setIsLoading)}
          isLoading={isLoading}
        />
      </Flex>
      {searchVisible && (
        <Input
          value={inputToShow}
          InputLeftElement={
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
            </Pressable>
          }
          InputRightElement={
            <Pressable onPress={() => (searchInput === "" ? toggleSearch() : clearSearch())}>
              <Icon as={<MaterialCommunityIcons name="close-circle-outline" />} size="md" mr={2} color="muted.400" />
            </Pressable>
          }
          onChangeText={(value) => {
            setInputToShow(value);
            setSearchInput(value);
          }}
          variant="unstyled"
          size="md"
          placeholder="Search"
          borderRadius={15}
          borderWidth={1}
          height={10}
          my={3}
          mx={3}
        />
      )}
    </>
  );
};

export default ChatHeader;
