import { useState } from "react";

import { Box, Flex, Icon, Input, Menu, Pressable, Text, useToast } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";
import axiosInstance from "../../../config/api";
import ReturnConfirmationModal from "../../shared/ReturnConfirmationModal";
import { ErrorToast, SuccessToast } from "../../shared/ToastDialog";

const ChatHeader = ({
  navigation,
  name,
  image,
  userId,
  fileAttachment,
  type,
  active_member,
  setForceRender,
  forceRender,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: exitModalIsOpen, toggle: toggleExitModal } = useDisclosure(false);
  const { isOpen: deleteGroupModalIsOpen, toggle: toggleDeleteGroupModal } = useDisclosure(false);

  const toast = useToast();

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const groupExitHandler = async (group_id, setIsLoading) => {
    try {
      const res = await axiosInstance.post(`/chat/group/exit`, { group_id: group_id });
      setForceRender(!forceRender);
      toggleExitModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Exited" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  const groupDeleteHandler = async (group_id, setIsLoading) => {
    try {
      const res = await axiosInstance.delete(`/chat/group/${group_id}`);
      toggleDeleteGroupModal();
      navigation.goBack();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Deleted" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
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
