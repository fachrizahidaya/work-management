import { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useDisclosure } from "../../hooks/useDisclosure";
import { useLoading } from "../../hooks/useLoading";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../config/api";
import RemoveConfirmationModal from "../../components/shared/RemoveConfirmationModal";
import UserListModal from "../../components/Chat/UserDetail/UserListModal";
import MemberListActionModal from "../../components/Chat/UserDetail/MemberListActionModal";
import UserAvatar from "../../components/Chat/UserDetail/UserAvatar";
import UserInformation from "../../components/Chat/UserDetail/UserInformation";
import UserAction from "../../components/Chat/UserDetail/UserAction";
import UserMedia from "../../components/Chat/UserDetail/UserMedia";
import UserPersonalized from "../../components/Chat/UserDetail/UserPersonalized";

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
  const [isReady, setIsReady] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const {
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

  const { isLoading: removeMemberIsLoading, toggle: toggleRemoveMember } = useLoading(false);
  const { isLoading: addMemberIsLoading, toggle: toggleAddMember } = useLoading(false);

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
  } = useFetch(memberListIsopen && "/chat/user", [currentPage, searchInput], fetchUserParameters);

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
   * Fetch media for pictures and docs
   */
  const { data: media, isFetching: mediaIsFetching, refetch: refetchMedia } = useFetch(`/chat/${type}/${roomId}/media`);
  const {
    data: document,
    isFetching: documentIsFetching,
    refetch: refetchDocument,
  } = useFetch(`/chat/${type}/${roomId}/docs`);

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
      toggleMemberList();
      setSelectedUsers([]);
      Toast.show({
        type: "success",
        text1: "Member added",
        position: "bottom",
      });
    } catch (err) {
      toggleAddMember();
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
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
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
      toggleRemoveMemberAction();
      Toast.show({
        type: "success",
        text1: "Member removed",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      toggleRemoveMember();
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
      Toast.show({
        type: "success",
        text1: "Group Profile updated",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
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
      return users?.filter((user) => {
        return !selectedGroupMembers.some((groupMember) => {
          return groupMember?.user_id === user?.id;
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
    const myMemberObj = selectedGroupMembers?.find((groupMember) => groupMember.user_id === loggedInUser);
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
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Pressable onPress={() => navigation.goBack()}>
                <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
              </Pressable>
              <Text style={{ fontWeight: "500" }}>{type === "personal" ? "Contact Info" : "Group Info"}</Text>
            </View>
          </View>
          <View style={{ flex: 1, position: "relative", gap: 10, backgroundColor: "#FAFAFA" }}>
            <UserAvatar
              navigation={navigation}
              roomId={roomId}
              type={type}
              name={name}
              image={image}
              position={position}
              onUpdateGroup={groupUpdateHandler}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              imageAttachment={imageAttachment}
              setImageAttachment={setImageAttachment}
              currentUserIsAdmin={currentUserIsAdmin}
            />
            <UserInformation
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
            {/* <UserMedia
          qty={media?.data?.length + document?.data?.length}
          media={media?.data}
          docs={document?.data}
          navigation={navigation}
        /> */}
            {/* <UserPersonalized /> */}
            <UserAction
              type={type}
              active_member={active_member}
              toggleClearChatMessage={toggleClearChatMessage}
              toggleExitModal={toggleExitModal}
              toggleDeleteGroupModal={toggleDeleteGroupModal}
            />
          </View>
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
            toggleAddMember={toggleAddMember}
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
        </SafeAreaView>
      ) : null}
    </>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
