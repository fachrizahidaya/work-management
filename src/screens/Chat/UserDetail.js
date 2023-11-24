import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import { Badge, Box, Flex, Icon, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import RemoveConfirmationModal from "../../components/Chat/ChatHeader/RemoveConfirmationModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import UserListModal from "../../components/Chat/UserDetail/UserListModal";
import { useFetch } from "../../hooks/useFetch";
import MemberListActionModal from "../../components/Chat/UserDetail/MemberListActionModal";
import UserAvatar from "../../components/Chat/UserDetail/UserAvatar";
import UserInformation from "../../components/Chat/UserDetail/UserInformation";
import UserAction from "../../components/Chat/UserDetail/UserAction";

const UserDetail = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [memberId, setMemberId] = useState();
  const [memberName, setMemberName] = useState(null);
  const [memberAdminStatus, setMemberAdminStatus] = useState(null);

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
    toggleClearChatMessage,
    onUpdateAdminStatus,
    onMemberDelete,
    isLoadingRemoveMember,
  } = route.params;

  const { isOpen: memberListIsopen, toggle: toggleMemberList } = useDisclosure(false);
  const { isOpen: memberListActionIsopen, toggle: toggleMemberListAction } = useDisclosure(false);
  const { isOpen: removeMemberActionIsopen, toggle: toggleRemoveMemberAction } = useDisclosure(false);

  const { isLoading: isLoadingMemberAction, toggle: toggleMemberAction } = useLoading(false);

  const fetchTaskParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  // const {
  //   data: userList,
  //   isFetching: userListIsFetching,
  //   refetch: refetchUserList,
  // } = useFetch("/chat/task", [currentPage, searchInput], fetchTaskParameters);

  // const selectTaskHandler = (task) => {
  //   setBandAttachment(task);
  //   toggleTaskList();
  // };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 1000),
    []
  );

  useEffect(() => {
    const myMemberObj = selectedGroupMembers.find((groupMember) => groupMember.user_id === loggedInUser);
    setCurrentUserIsAdmin(myMemberObj?.is_admin ? true : false);
  }, [selectedGroupMembers, loggedInUser]);

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
        <UserAvatar type={type} name={name} image={image} position={position} email={email} />
        <UserInformation
          type={type}
          selectedGroupMembers={selectedGroupMembers}
          loggedInUser={loggedInUser}
          toggleMemberList={toggleMemberList}
          currentUserIsAdmin={currentUserIsAdmin}
          toggleMemberListAction={toggleMemberListAction}
          memberId={memberId}
          setMemberId={setMemberId}
          memberName={memberName}
          setMemberName={setMemberName}
          memberAdminStatus={memberAdminStatus}
          setMemberAdminStatus={setMemberAdminStatus}
          toggleRemoveMemberAction={toggleRemoveMemberAction}
        />
        <UserAction
          type={type}
          active_member={active_member}
          toggleClearChatMessage={toggleClearChatMessage}
          toggleDeleteModal={toggleDeleteModal}
          toggleExitModal={toggleExitModal}
          toggleDeleteGroupModal={toggleDeleteGroupModal}
        />
      </Flex>
      <RemoveConfirmationModal
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
      <RemoveConfirmationModal
        isOpen={removeMemberActionIsopen}
        toggle={toggleRemoveMemberAction}
        description="Are you sure want to remove member from group?"
        onPress={() => {
          onMemberDelete(memberId);
          toggleRemoveMemberAction();
        }}
        isLoading={isLoadingRemoveMember}
      />
      <UserListModal memberListIsopen={memberListIsopen} toggleMemberList={toggleMemberList} />
      <MemberListActionModal
        memberListActionIsopen={memberListActionIsopen}
        toggleMemberListAction={toggleMemberListAction}
        memberId={memberId}
        setMemberId={setMemberId}
        memberName={memberName}
        setMemberName={setMemberName}
        memberAdminStatus={memberAdminStatus}
        setMemberAdminStatus={setMemberAdminStatus}
        onUpdateAdminStatus={onUpdateAdminStatus}
        currentUserIsAdmin={currentUserIsAdmin}
        toggleRemoveMemberAction={toggleRemoveMemberAction}
      />
    </>
  );
};

export default UserDetail;
