import { useState } from "react";

import { Box, Flex, Icon, Input, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";

const ChatHeader = ({ navigation, name, image, userId, imageAttachment, fileAttachment, type }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
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
            <Text>Project Analyst</Text>
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
              <Menu.Item>
                <Text>Exit Group</Text>
              </Menu.Item>
            ) : (
              <Menu.Item onPress={toggleDeleteModal}>
                <Text>Delete Chat</Text>
              </Menu.Item>
            )}
          </Menu>

          <ConfirmationModal
            isOpen={deleteModalIsOpen}
            toggle={toggleDeleteModal}
            header="Delete Chat"
            description="Are you sure want to delete this chat?"
            isDelete={true}
            isPatch={false}
            hasSuccessFunc={true}
            apiUrl={`/chat/personal/${userId}`}
            onSuccess={() => {
              toggleDeleteModal();
              navigation.goBack();
            }}
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
            <Pressable
              onPress={
                searchInput === ""
                  ? () => toggleSearch()
                  : () => {
                      setInputToShow("");
                      setSearchInput("");
                    }
              }
            >
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
