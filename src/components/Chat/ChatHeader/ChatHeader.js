import { useState } from "react";

import { Box, Flex, Icon, Input, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";
import ReturnConfirmationModal from "../../shared/ReturnConfirmationModal";

const ChatHeader = ({
  navigation,
  name,
  image,
  position,
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
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");

  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const clearSearch = () => {
    setInputToShow("");
    setSearchInput("");
  };

  const closeDeleteModalHandler = () => {
    toggleDeleteModal();
    navigation.goBack();
  };

  return (
    <>
      <Flex direction="row" justifyContent="space-between" bg="white" borderBottomWidth={1} borderColor="#E8E9EB" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => navigation.navigate("Chat List")}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>

          <AvatarPlaceholder name={name} image={image} size="md" />

          <Box>
            <Text fontSize={16}>{name}</Text>
            {type === "personal" ? (
              <Text>{position}</Text>
            ) : (
              <Flex flexDirection="row">
                {selectedGroupMembers.map((member, index) => {
                  return (
                    <Text
                      fontSize={10}
                      fontWeight={400}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ maxWidth: 80, overflow: "hidden" }}
                    >
                      {loggedInUser === member?.user?.id ? "You" : member?.user?.name}
                      {index < selectedGroupMembers.length - 1 && `${", "}`}
                    </Text>
                  );
                })}
              </Flex>
            )}
          </Box>
        </Flex>

        <Flex direction="row" alignItems="center">
          <Menu
            w={160}
            mt={8}
            trigger={(trigger) => {
              return fileAttachment ? null : (
                <Pressable {...trigger} mr={1}>
                  <Icon as={<MaterialIcons name="more-horiz" />} color="black" size="md" />
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={toggleSearch}>
              <Text>Search</Text>
            </Menu.Item>
            {type === "group" ? (
              <>
                {active_member === 1 ? (
                  <Menu.Item onPress={toggleExitModal}>
                    <Text>Exit Group</Text>
                  </Menu.Item>
                ) : (
                  <Menu.Item onPress={toggleDeleteGroupModal}>
                    <Text>Delete Group</Text>
                  </Menu.Item>
                )}
              </>
            ) : (
              <Menu.Item onPress={toggleDeleteModal}>
                <Text>Delete Chat</Text>
              </Menu.Item>
            )}
          </Menu>

          {type === "group" && active_member === 1 && (
            <>
              <ReturnConfirmationModal
                isOpen={exitModalIsOpen}
                toggle={toggleExitModal}
                description="Are you sure want to exit this group?"
                onPress={() => groupExitHandler(userId)}
              />
            </>
          )}

          {type === "group" && active_member === 0 && (
            <>
              <ReturnConfirmationModal
                isOpen={deleteGroupModalIsOpen}
                toggle={toggleDeleteGroupModal}
                description="Are you sure want to delete this group?"
                onPress={() => groupDeleteHandler(userId)}
              />
            </>
          )}

          <ConfirmationModal
            isOpen={deleteModalIsOpen}
            toggle={toggleDeleteModal}
            header="Delete Chat"
            description="Are you sure want to delete this chat?"
            isDelete={true}
            isPatch={false}
            hasSuccessFunc={true}
            apiUrl={`/chat/personal/${userId}`}
            onSuccess={() => closeDeleteModalHandler()}
            successMessage="Chat Deleted"
          />
        </Flex>
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
