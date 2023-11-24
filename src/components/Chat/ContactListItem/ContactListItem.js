import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { Box, Flex, HStack, Icon, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TouchableOpacity } from "react-native";
import axiosInstance from "../../../config/api";
import { ErrorToast, SuccessToast } from "../../shared/ToastDialog";
import { useLoading } from "../../../hooks/useLoading";

const ContactListItem = ({
  type,
  id,
  userId,
  name,
  image,
  position,
  email,
  message,
  isDeleted,
  fileName,
  project,
  task,
  time,
  timestamp,
  searchKeyword,
  active_member,
  setForceRerender,
  forceRerender,
  isRead,
  isPinned,
  onUpdatePinHandler,
}) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const navigation = useNavigation();
  const toast = useToast();

  const { isLoading: isLoadingRemoveMember, toggle: toggleRemoveMember } = useLoading(false);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderName = () => {
    return boldMatchCharacters(name, searchKeyword);
  };

  const generateIcon = () => {
    let iconName = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        iconName = "image";
      } else {
        iconName = "file-document";
      }
    }
    if (project) {
      iconName = "lightning-bolt";
    }
    if (task) {
      iconName = "checkbox-marked-circle-outline";
    }

    return iconName;
  };

  const generateAttachmentText = () => {
    let text = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        text = "Photo";
      } else {
        text = "File";
      }
    }
    if (project) {
      text = "Project";
    }
    if (task) {
      text = "Task";
    }

    return text;
  };

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${id}/member`);
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
  const groupMemberAddHandler = async (group_id, new_members, setIsLoading) => {
    try {
      const res = await axiosInstance.post(`/chat/group/member`, {
        group_id: group_id,
        member: new_members,
      });

      fetchSelectedGroupMembers();
      setIsLoading(false);
    } catch (err) {
      enqueueSnackbar("Something went wrong", {
        autoHideDuration: 3000,
        content: (key, message) => <Error id={key} message={message} subMessage={err.response.data.message} />,
      });
      setIsLoading(false);
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

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat Room", {
          userId,
          name: name,
          roomId: id,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          setForceRender: setForceRerender,
          forceRender: forceRerender,
          selectedGroupMembers: selectedGroupMembers,
          onUpdatePinHandler: onUpdatePinHandler,
          onUpdateAdminStatus: groupMemberUpdateHandler,
          onMemberDelete: groupMemberDeleteHandler,
          isLoadingRemoveMember: isLoadingRemoveMember,
          isPinned: isPinned,
        });
      }}
    >
      <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
        <Flex flexDir="row" gap={4} alignItems="center" flex={1}>
          <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />

          <Box flex={1}>
            <HStack justifyContent="space-between">
              {!searchKeyword ? (
                <Text>{name}</Text>
              ) : (
                <RenderHtml
                  contentWidth={400}
                  source={{
                    html: renderName(),
                  }}
                />
              )}

              <Flex flexDirection="row">
                <ChatTimeStamp time={time} timestamp={timestamp} />
              </Flex>
            </HStack>

            <Flex flexDir="row" alignItems="center" gap={1}>
              {!isDeleted ? (
                <>
                  <HStack alignItems="center" justifyContent="space-between" flex={1}>
                    {message && <Text>{message.length > 35 ? message.slice(0, 35) + "..." : message}</Text>}
                    {!!isRead && (
                      <Box
                        style={{
                          height: 25,
                          width: 25,
                        }}
                        bgColor="#FD7972"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize={12} textAlign="center" color="white">
                          {isRead > 20 ? "20+" : isRead}
                        </Text>
                      </Box>
                    )}
                  </HStack>
                  {message === null && (project || task || fileName) && (
                    <HStack alignItems="center" space={1}>
                      <Icon as={<MaterialCommunityIcons name={generateIcon()} />} size="md" />
                      <Text>{generateAttachmentText()}</Text>
                    </HStack>
                  )}
                </>
              ) : (
                <Text fontStyle="italic" opacity={0.5}>
                  Message has been deleted
                </Text>
              )}
              {isPinned?.pin_chat ? (
                <Icon
                  as={<MaterialCommunityIcons name="pin" />}
                  size="md"
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              ) : null}
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );
};

export default ContactListItem;
