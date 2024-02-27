import { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import { useLoading } from "../../../hooks/useLoading";
import { useFetch } from "../../../hooks/useFetch";
import {
  ErrorToastProps,
  SuccessToastProps,
} from "../../../components/shared/CustomStylings";
import axiosInstance from "../../../config/api";
import RemoveConfirmationModal from "../../../components/shared/RemoveConfirmationModal";
import UserListModal from "../../../components/Chat/UserDetail/UserListModal";
import MemberListActionModal from "../../../components/Chat/UserDetail/MemberListActionModal";
import ContactAvatar from "../../../components/Chat/UserDetail/ContactAvatar";
import ContactInformation from "../../../components/Chat/UserDetail/ContactInformation";
import ContactAction from "../../../components/Chat/UserDetail/ContactAction";
import ContactMedia from "../../../components/Chat/UserDetail/ContactMedia";
import ContactPersonalized from "../../../components/Chat/UserDetail/ContactPersonalized";

const ContactDetail = () => {
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
  const [isReady, setIsReady] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const {
    name,
    image,
    position,
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
  } = route.params;

  const { isOpen: memberListIsopen, toggle: toggleMemberList } =
    useDisclosure(false);
  const { isOpen: memberListActionIsopen, toggle: toggleMemberListAction } =
    useDisclosure(false);
  const { isOpen: removeMemberActionIsopen, toggle: toggleRemoveMemberAction } =
    useDisclosure(false);
  const { isOpen: clearChatMessageIsOpen, toggle: toggleClearChatMessage } =
    useDisclosure(false);

  const { isLoading: removeMemberIsLoading, toggle: toggleRemoveMember } =
    useLoading(false);
  const { isLoading: addMemberIsLoading, toggle: toggleAddMember } =
    useLoading(false);
  const { isLoading: clearMessageIsLoading, toggle: toggleClearMessage } =
    useLoading(false);

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
  } = useFetch(
    memberListIsopen && "/chat/user",
    [currentPage, searchInput],
    fetchUserParameters
  );

  const fetchMorUser = () => {
    if (currentPage < userList?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${roomId}/member`);
      setSelectedGroupMembers(res?.data?.data);
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Fetch media for pictures and docs
   */
  const {
    data: media,
    isFetching: mediaIsFetching,
    refetch: refetchMedia,
  } = useFetch(`/chat/${type}/${roomId}/media`);
  const {
    data: document,
    isFetching: documentIsFetching,
    refetch: refetchDocument,
  } = useFetch(`/chat/${type}/${roomId}/docs`);

  /**
   * Handle clear chat
   * @param {*} id
   * @param {*} type
   * @param {*} itemName
   */
  const clearChatMessageHandler = async (id, type, itemName) => {
    try {
      toggleClearMessage();
      await axiosInstance.delete(`/chat/${type}/${id}/message/clear`);
      toggleClearMessage();
      toggleClearChatMessage();
      Toast.show("Chat cleared", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleClearMessage();
      Toast.show(err.response.data.message, ErrorToastProps);
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
      setSelectedUsers([]);
      fetchSelectedGroupMembers();
      refetchUserList();
      toggleAddMember();
      toggleMemberList();
      Toast.show("Member added", SuccessToastProps);
    } catch (err) {
      toggleAddMember();
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
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
      const res = await axiosInstance.patch(
        `/chat/group/member/${group_member_id}`,
        {
          is_admin: data,
        }
      );
      fetchSelectedGroupMembers();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
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
      const res = await axiosInstance.delete(
        `/chat/group/member/${group_member_id}`
      );
      fetchSelectedGroupMembers();
      toggleRemoveMember();
      toggleRemoveMemberAction();
      Toast.show("Member removed", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleRemoveMember();
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle filter from member registered for add new member to group
   * @param {*} users
   * @returns
   */
  const usersWithoutMembers = (users) => {
    if (selectedGroupMembers && selectedUsers) {
      const allSelectedMembers = [...selectedGroupMembers, ...selectedUsers];

      return users?.filter((user) => {
        return !allSelectedMembers.some((groupMember) => {
          return groupMember?.user_id === user?.id;
        });
      });
    } else {
      return users;
    }
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  /**
   * Handle select new member to the group
   * @param {*} user
   */
  const addSelectedUserToArray = (user) => {
    setSelectedUsers((prevState) => {
      if (!prevState?.find((val) => val.id === user.id)) {
        return [...prevState, { ...user, is_admin: 0 }];
      }
      return prevState;
    });
    setForceRerender((prev) => !prev);
  };

  const removeSelectedUserToArray = (user) => {
    const newUserArray = selectedUsers?.filter((val) => {
      return val.id !== user.id;
    });
    setSelectedUsers(newUserArray);
    setForceRerender((prev) => !prev);
  };

  useEffect(() => {
    const myMemberObj = selectedGroupMembers?.find(
      (groupMember) => groupMember.user_id === loggedInUser
    );
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
        setCumulativeData((prevData) => [
          ...prevData,
          ...usersWithoutMembers(userList?.data?.data),
        ]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [
          ...prevData,
          ...usersWithoutMembers(userList?.data?.data),
        ]);
        setCumulativeData([]);
      }
    }
  }, [userList, searchInput, selectedGroupMembers]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, []);

  return (
    <>
      {isReady ? (
        <SafeAreaView style={styles.container}>
          <View
            style={{
              ...styles.header,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Pressable onPress={() => navigation.goBack()}>
                <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {type === "personal" ? "Contact Info" : "Group Info"}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.content,
            }}
          >
            <ContactAvatar
              navigation={navigation}
              roomId={roomId}
              type={type}
              name={name}
              image={image}
              position={position}
              currentUserIsAdmin={currentUserIsAdmin}
            />

            <ContactInformation
              type={type}
              selectedGroupMembers={selectedGroupMembers}
              loggedInUser={loggedInUser}
              toggleMemberList={toggleMemberList}
              currentUserIsAdmin={currentUserIsAdmin}
              toggleMemberListAction={toggleMemberListAction}
              setMemberId={setMemberId}
              setMemberName={setMemberName}
              setMemberAdminStatus={setMemberAdminStatus}
              toggleRemoveMemberAction={toggleRemoveMemberAction}
            />

            {/* <ContactMedia
              qty={media?.data?.length + document?.data?.length}
              media={media?.data}
              docs={document?.data}
              navigation={navigation}
            /> */}

            {/* <ContactPersonalized /> */}

            <ContactAction
              type={type}
              active_member={active_member}
              toggleClearChatMessage={toggleClearChatMessage}
              toggleExitModal={toggleExitModal}
              toggleDeleteGroupModal={toggleDeleteGroupModal}
            />
          </View>

          {/* Confirmation modal to delete personal chat or exit group */}
          <RemoveConfirmationModal
            isOpen={
              type === "personal"
                ? deleteModalIsOpen
                : active_member === 1
                ? exitModalIsOpen
                : deleteGroupModalIsOpen
            }
            toggle={
              type === "personal"
                ? toggleDeleteModal
                : active_member === 1
                ? toggleExitModal
                : toggleDeleteGroupModal
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
                : null
            }
            isLoading={
              type === "group" ? chatRoomIsLoading : deleteChatMessageIsLoading
            }
          />

          {/* Confirmation modal to remove member from group */}
          <RemoveConfirmationModal
            isOpen={removeMemberActionIsopen}
            toggle={toggleRemoveMemberAction}
            description="Are you sure want to remove member from group?"
            onPress={() => {
              groupMemberDeleteHandler(memberId);
            }}
            isLoading={removeMemberIsLoading}
          />

          {/* Confirmation modal to clear chat */}
          <RemoveConfirmationModal
            isOpen={clearChatMessageIsOpen}
            toggle={toggleClearChatMessage}
            description="Are you sure want to clear chat?"
            isLoading={clearMessageIsLoading}
            onPress={() => {
              clearChatMessageHandler(roomId, type, toggleClearMessage);
              navigation.navigate("Chat List");
            }}
          />

          {/* If user as group admin, user can add member, delete member, etc. */}
          <UserListModal
            roomId={roomId}
            memberListIsopen={memberListIsopen}
            toggleMemberList={toggleMemberList}
            toggleAddMember={toggleAddMember}
            handleSearch={handleSearch}
            inputToShow={inputToShow}
            setInputToShow={setInputToShow}
            setSearchInput={setSearchInput}
            fetchMoreData={fetchMorUser}
            cumulativeData={cumulativeData}
            filteredDataArray={filteredDataArray}
            userListIsLoading={userListIsLoading}
            onPressAddHandler={addSelectedUserToArray}
            onPressRemoveHandler={removeSelectedUserToArray}
            selectedUsers={selectedUsers}
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
        </SafeAreaView>
      ) : null}
    </>
  );
};

export default ContactDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    position: "relative",
    gap: 10,
    backgroundColor: "#FAFAFA",
  },
});
