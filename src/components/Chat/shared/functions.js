import Toast from "react-native-root-toast";
import axiosInstance from "../../../config/api";
import { ErrorToastProps, SuccessToastProps } from "../../shared/CustomStylings";

/**
 * Handle Exit group
 * @param {*} group_id
 */
export const groupExitHandler = async (group_id, toggleProcess, toggleModal, navigation) => {
  try {
    toggleProcess();
    await axiosInstance.post(`/chat/group/exit`, { group_id: group_id });
    toggleProcess();
    toggleModal();
    navigation.navigate("Chat List");
    Toast.show("Group exited", SuccessToastProps);
  } catch (err) {
    console.log(err);
    toggleProcess();
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};

/**
 * Handle Delete group after exit group
 * @param {*} group_id
 */
export const groupDeleteHandler = async (group_id, toggleProcess, toggleModal, navigation) => {
  try {
    toggleProcess();
    await axiosInstance.delete(`/chat/group/${group_id}`);
    toggleProcess();
    toggleModal();
    if (navigation) {
      navigation.navigate("Chat List");
    }
    Toast.show("Group deleted", SuccessToastProps);
  } catch (err) {
    console.log(err);
    toggleProcess(false);
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};

/**
 * Handle clear chat
 * @param {*} id
 * @param {*} type
 * @param {*} itemName
 */
export const clearChatMessageHandler = async (id, type, toggleProcess, toggleModal) => {
  try {
    toggleProcess();
    await axiosInstance.delete(`/chat/${type}/${id}/message/clear`);
    toggleProcess();
    toggleModal();
    Toast.show("Chat cleared", SuccessToastProps);
  } catch (err) {
    console.log(err);
    toggleProcess();
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};

/**
 * Handle Delete chat room personal
 * @param {*} id
 */
export const deleteChatPersonal = async (id, toggleProcess, toggleModal, navigation) => {
  try {
    toggleProcess();
    await axiosInstance.delete(`/chat/personal/${id}`);
    toggleProcess();
    toggleModal();
    if (navigation) {
      navigation.navigate("Chat List");
    }
    Toast.show("Chat deleted", SuccessToastProps);
  } catch (err) {
    console.log(err);
    toggleProcess();
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};

/**
 * Handle chat pin update event
 *
 * @param {*} id - Personal chat id / Group chat id
 * @param {*} action - either pin/unpin
 */
export const pinChatHandler = async (chatType, id, action, navigation) => {
  try {
    const res = await axiosInstance.patch(`/chat/${chatType}/${id}/${action}`);
    if (navigation) {
      navigation.goBack();
    }
  } catch (err) {
    console.log(err);
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};
