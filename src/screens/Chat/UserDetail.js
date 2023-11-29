import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Flex, Icon, Pressable, Text, useToast } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";

import RemoveConfirmationModal from "../../components/Chat/ChatHeader/RemoveConfirmationModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import UserListModal from "../../components/Chat/UserDetail/UserListModal";
import { useFetch } from "../../hooks/useFetch";
import MemberListActionModal from "../../components/Chat/UserDetail/MemberListActionModal";
import UserAvatar from "../../components/Chat/UserDetail/UserAvatar";
import UserInformation from "../../components/Chat/UserDetail/UserInformation";
import UserAction from "../../components/Chat/UserDetail/UserAction";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import axiosInstance from "../../config/api";

const UserDetail = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [memberId, setMemberId] = useState();
  const [memberName, setMemberName] = useState(null);
  const [memberAdminStatus, setMemberAdminStatus] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [cumulativeData, setCumulativeData] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [imageAttachment, setImageAttachment] = useState(null);

  const route = useRoute();
  const {
    navigation,
    name,
    image,
    position,
    email,
    type,
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
    deleteChatMessageIsLoading,
    chatRoomIsLoading,
    toggleDeleteChatMessage,
    toggleClearChatMessage,
  } = route.params;

  const { isOpen: memberListIsopen, toggle: toggleMemberList } = useDisclosure(false);
  const { isOpen: memberListActionIsopen, toggle: toggleMemberListAction } = useDisclosure(false);
  const { isOpen: removeMemberActionIsopen, toggle: toggleRemoveMemberAction } = useDisclosure(false);

  const { isLoading: memberActionIsLoading, toggle: toggleMemberAction } = useLoading(false);
  const { isLoading: removeMemberIsLoading, toggle: toggleRemoveMember } = useLoading(false);
  const { isLoading: addMemberIsLoading, toggle: toggleAddMember } = useLoading(false);

  const toast = useToast();

  const fetchUserParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  const {
    data: userList,
    isFetching: userListIsFetching,
    isLoading: userListIsLoading,
    refetch: refetchUserList,
  } = useFetch("/chat/user", [currentPage, searchInput], fetchUserParameters);

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${roomId}/member`);
      setSelectedGroupMembers(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle group member add event
   *
   * @param {*} data
   */
  const groupMemberAddHandler = async (group_id, new_members) => {
    try {
      toggleAddMember();
      const res = await axiosInstance.post(`/chat/group/member`, {
        group_id: group_id,
        member: new_members,
      });
      fetchSelectedGroupMembers();
      toggleAddMember();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Member Added" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
      toggleAddMember();
    }
  };

  /**
   * Handle group member admin status changes event
   *
   * @param {*} group_member_id
   * @param {*} data
   */
  const groupMemberUpdateHandler = async (group_member_id, data) => {
    try {
      const res = await axiosInstance.patch(`/chat/group/member/${group_member_id}`, {
        is_admin: data,
      });
      fetchSelectedGroupMembers();
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Handle group member removal event
   *
   * @param {*} group_member_id
   */
  const groupMemberDeleteHandler = async (group_member_id, item_name) => {
    try {
      toggleRemoveMember();
      const res = await axiosInstance.delete(`/chat/group/member/${group_member_id}`);
      fetchSelectedGroupMembers();
      toggleRemoveMember();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Member Removed" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toggleRemoveMember();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Handle group update event
   *
   * @param {*} group_id
   * @param {*} data
   */
  const groupUpdateHandler = async (group_id, data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/chat/group/${group_id}`, data);
      setSubmitting(false);
      setStatus("success");
      navigation.navigate("Chat List");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Profile Updated" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
    }
  };

  const editGroupPictureHandler = async (group_id) => {
    try {
      const formData = new FormData();
      formData.append("image", imageAttachment);
      formData.append("_method", "PATCH");
      const res = await axiosInstance.patch(`/chat/group/${group_id}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setImageAttachment(null);
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Profile Picture Updated"} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Update failed, please try again later..."} close={() => toast.close(id)} />;
        },
      });
    }
  };

  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (fileInfo.size >= 1000000) {
      toast.show({ description: "Image size is too large" });
      return;
    }

    if (result) {
      setImageAttachment({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  /**
   * Handle filter from member registered for add new member to group
   * @param {*} users
   * @returns
   */
  const usersWithoutMembers = (users) => {
    if (selectedGroupMembers) {
      return users.filter((user) => {
        return !selectedGroupMembers.some((groupMember) => {
          return groupMember.user_id === user.id;
        });
      });
    } else {
      return users;
    }
  };

  const fetchMoreData = () => {
    if (currentPage < userList?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const addSelectedUserToArray = (user) => {
    setSelectedUsers((prevState) => {
      if (!prevState.find((val) => val.id === user.id)) {
        return [...prevState, { ...user, is_admin: 0 }];
      }
      return prevState;
    });
    setForceRerender((prev) => !prev);
  };

  const removeSelectedUserToArray = (user) => {
    const newUserArray = selectedUsers.filter((val) => {
      return val.id !== user.id;
    });
    setSelectedUsers(newUserArray);
    setForceRerender((prev) => !prev);
  };

  useEffect(() => {
    const myMemberObj = selectedGroupMembers.find((groupMember) => groupMember.user_id === loggedInUser);
    setCurrentUserIsAdmin(myMemberObj?.is_admin ? true : false);
  }, [selectedGroupMembers, loggedInUser]);

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [roomId]);

  useEffect(() => {
    setFilteredDataArray([]);
  }, [searchInput]);

  useEffect(() => {
    if (userList?.data?.data?.length) {
      if (!searchInput) {
        setCumulativeData((prevData) => [...prevData, ...usersWithoutMembers(userList?.data?.data)]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...usersWithoutMembers(userList?.data?.data)]);
        setCumulativeData([]);
      }
    }
  }, [userList]);

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
        <UserAvatar
          roomId={roomId}
          type={type}
          name={name}
          image={image}
          position={position}
          email={email}
          onUpdateGroup={groupUpdateHandler}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          imageAttachment={imageAttachment}
          setImageAttachment={setImageAttachment}
        />
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
        isLoading={type === "group" ? chatRoomIsLoading : deleteChatMessageIsLoading}
      />
      <RemoveConfirmationModal
        isOpen={removeMemberActionIsopen}
        toggle={toggleRemoveMemberAction}
        description="Are you sure want to remove member from group?"
        onPress={() => {
          groupMemberDeleteHandler(memberId);
        }}
        isLoading={removeMemberIsLoading}
      />
      <UserListModal
        roomId={roomId}
        memberListIsopen={memberListIsopen}
        toggleMemberList={toggleMemberList}
        userList={userList}
        handleSearch={handleSearch}
        inputToShow={inputToShow}
        setInputToShow={setInputToShow}
        setSearchInput={setSearchInput}
        fetchMoreData={fetchMoreData}
        cumulativeData={cumulativeData}
        filteredDataArray={filteredDataArray}
        userListIsLoading={userListIsLoading}
        onPressAddHandler={addSelectedUserToArray}
        onPressRemoveHandler={removeSelectedUserToArray}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        forceRerender={forceRerender}
        onAddMoreMember={groupMemberAddHandler}
        addMemberIsLoading={addMemberIsLoading}
      />
      <MemberListActionModal
        memberListActionIsopen={memberListActionIsopen}
        toggleMemberListAction={toggleMemberListAction}
        memberId={memberId}
        setMemberId={setMemberId}
        memberName={memberName}
        setMemberName={setMemberName}
        memberAdminStatus={memberAdminStatus}
        setMemberAdminStatus={setMemberAdminStatus}
        onUpdateAdminStatus={groupMemberUpdateHandler}
        currentUserIsAdmin={currentUserIsAdmin}
        toggleRemoveMemberAction={toggleRemoveMemberAction}
      />
    </>
  );
};

export default UserDetail;
