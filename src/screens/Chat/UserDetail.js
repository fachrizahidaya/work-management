import React from "react";

import { Badge, Box, Flex, Icon, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import RemoveConfirmationModal from "../../components/Chat/ChatHeader/RemoveConfirmationModal";

const UserDetail = () => {
  const route = useRoute();
  const {
    navigation,
    name,
    image,
    position,
    email,
    type,
    selectedGroupMembers,
    loggedInUser,
    active_member,
    toggleDeleteModal,
    toggleExitModal,
    toggleDeleteGroupModal,
    deleteModalIsOpen,
    exitModalIsOpen,
    deleteGroupModalIsOpen,
    deleteChatPersonal,
    roomId,
    isLoadingDeleteChatMessage,
    isLoadingChatRoom,
    toggleDeleteChatMessage,
  } = route.params;

  return (
    <>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text>{type === "personal" ? "Contact Detail" : "Group Detail"}</Text>
        </Flex>
      </Flex>
      <Flex gap={2} flex={1} bg="#FAFAFA" position="relative">
        <Flex pb={2} gap={2} bg="#FFFFFF" alignItems="center" justifyContent="center">
          <AvatarPlaceholder size="2xl" name={name} image={image} />
          <Text fontSize={16} fontWeight={500}>
            {name}
          </Text>
          {type === "personal " ? (
            <Box alignItems="center">
              <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
                {position}
              </Text>
              <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
                {email}
              </Text>
            </Box>
          ) : null}
        </Flex>
        <Flex px={16} py={2} gap={2} bg="#FFFFFF">
          <Box gap={2}>
            <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
              {type === "personal" ? "Status" : "Group participant"}
            </Text>
            {type === "personal" ? (
              <Text fontSize={12} fontWeight={400}>
                Active
              </Text>
            ) : (
              <Flex gap={2} flexDirection="row" flexWrap="wrap" alignItems="center">
                {selectedGroupMembers.map((member, index) => {
                  return (
                    <Badge borderRadius={15}>
                      <Flex gap={2} alignItems="center" flexDirection="row">
                        <AvatarPlaceholder name={member?.user?.name} image={member?.user?.image} />
                        {loggedInUser === member?.user?.id ? "You" : member?.user?.name}
                        {member?.is_admin ? (
                          <Badge borderRadius={15} colorScheme="#186688">
                            Admin
                          </Badge>
                        ) : null}
                      </Flex>
                    </Badge>
                  );
                })}
                <Badge borderRadius="full">
                  <Icon as={<MaterialIcons name={"add"} />} size={5} />
                </Badge>
              </Flex>
            )}
          </Box>
        </Flex>
        <Flex flex={1} px={16} py={2} gap={2} bg="#FFFFFF">
          {type === "personal" && (
            <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleDeleteModal}>
              <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
              <Text fontSize={14} fontWeight={400}>
                Delete Chat
              </Text>
            </Pressable>
          )}
          {type === "group" && active_member === 1 ? (
            <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleExitModal}>
              <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
              <Text fontSize={14} fontWeight={400}>
                Exit Group
              </Text>
            </Pressable>
          ) : (
            <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleDeleteGroupModal}>
              <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
              <Text fontSize={14} fontWeight={400}>
                Delete Group
              </Text>
            </Pressable>
          )}
        </Flex>
      </Flex>
      <RemoveConfirmationModal
        // isOpen={deleteModalIsOpen}
        // toggle={toggleDeleteModal}
        // description="Are you sure want to delete this chat?"
        // onPress={() => deleteChatPersonal(roomId, toggleDeleteChatMessage)}
        // isLoading={isLoadingDeleteChatMessage}
        isOpen={
          type === "personal" ? deleteModalIsOpen : active_member === 1 ? exitModalIsOpen : deleteGroupModalIsOpen
        }
        toggle={
          type === "personal" ? toggleDeleteModal : active_member === 1 ? toggleExitModal : toggleDeleteGroupModal
        }
        description={
          type === "personal"
            ? "Are you sure want to delete this chat?"
            : type === "group" && active_member === 1
            ? "Are you sure want to exit this group?"
            : type === "group" && active_member === 0
            ? "Are you sure want to delete this group?"
            : null
        }
        onPress={() =>
          type === "personal"
            ? deleteChatPersonal(roomId, toggleDeleteChatMessage)
            : type === "group" && active_member === 1
            ? groupExitHandler(roomId, toggleChatRoom)
            : type === "group" && active_member === 0
            ? groupDeleteHandler(roomId, toggleChatRoom)
            : null
        }
        isLoading={type === "group" ? isLoadingChatRoom : isLoadingDeleteChatMessage}
      />
    </>
  );
};

export default UserDetail;
