import { useEffect, useState } from "react";
import { useFormik } from "formik";

import { View, Text, Pressable, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { MentionInput } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ChatReplyPreview from "./ChatReplyPreview";
import { TextProps } from "../../shared/CustomStylings";

const ChatInput = ({
  userId,
  roomId,
  type,
  fileAttachment,
  onSendMessage,
  setFileAttachment,
  bandAttachment,
  setBandAttachment,
  bandAttachmentType,
  setBandAttachmentType,
  messageToReply,
  setMessageToReply,
  active_member,
  groupMember,
  selectFile,
  onAddImage,
  navigation,
  name,
  image,
  position,
  email,
  isPinned,
  memberName,
  forwardedMessage,
  forwardedProject,
  forwardedTask,
  forwarded_file_path,
  forwarded_file_name,
  forwarded_file_size,
  forwarded_mime_type,
}) => {
  const [forwardedBandAttachment, setForwardedBandAttachment] = useState(null);
  const [forwardedBandAttachmentType, setForwardedBandAttachmentType] = useState(null);

  const attachmentOptions = [
    {
      icon: "file-document-outline",
      name: "Document",
      color: "#1E4AB9",
      onPress: () => {
        selectFile(setFileAttachment, true);
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        onAddImage();
      },
    },
    {
      icon: "circle-slice-2",
      name: "Project/Task",
      color: "#EB0E29",
      onPress: () => {
        navigation.navigate("Project Screen", {
          bandAttachment: bandAttachment,
          setBandAttachment: setBandAttachment,
          bandAttachmentType: bandAttachmentType,
          setBandAttachmentType: setBandAttachmentType,
          userId: userId,
          name: name,
          roomId: roomId,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          isPinned: isPinned,
        });
        SheetManager.hide("form-sheet");
      },
    },
  ];

  const memberData = groupMember.map((item) => ({
    id: item?.user?.id,
    name: item?.user?.name,
  }));

  const forwardedAttachment = {
    name: forwarded_file_name,
    size: forwarded_file_size,
    type: forwarded_mime_type,
    webkitRelativePath: "",
    uri: `${process.env.EXPO_PUBLIC_API}/image/${forwarded_file_path}`,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      to_user_id: type === "personal" ? userId : null || "",
      group_id: type === "group" ? roomId : null || "",
      reply_to_id: messageToReply?.id || "",
      message: "",
      file: "",
      project_id: "",
      project_no: "",
      project_title: "",
      task_id: "",
      task_no: "",
      task_title: "",
    },
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      if (
        formik.values.message !== "" ||
        formik.values.file !== "" ||
        formik.values.project_id !== "" ||
        formik.values.task_id !== ""
      ) {
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        formData.append("message", values.message.replace(/(<([^>]+)>)/gi, ""));
        setStatus("processing");
        onSendMessage(formData, setSubmitting, setStatus);
      }
      resetForm();
      setFileAttachment(null);
      setBandAttachment(null);
      setBandAttachmentType(null);
      setMessageToReply(null);
    },
  });

  /**
   * Handle for forward message
   */
  const forwardedMessageFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      to_user_id: type === "personal" ? userId : null || "",
      group_id: type === "group" ? roomId : null || "",
      reply_to_id: messageToReply?.id || "",
      message: "",
      file: "",
      project_id: "",
      project_no: "",
      project_title: "",
      task_id: "",
      task_no: "",
      task_title: "",
    },
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      const messageToForward = forwardedMessage ? forwardedMessage : forwardedMessageFormik.values.message;
      const attachmentToForward = !forwardedAttachment.name ? forwardedMessageFormik.values.file : forwardedAttachment;
      const projectToForward = forwardedProject ? forwardedProject : forwardedMessageFormik.values.project_id;
      const taskToForward = forwardedTask ? forwardedTask : forwardedMessageFormik.values.task_id;

      if (messageToForward !== "" || attachmentToForward !== "" || projectToForward !== "" || taskToForward !== "") {
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        formData.append("message", values.message.replace(/(<([^>]+)>)/gi, ""));
        setStatus("processing");
        onSendMessage(formData, setSubmitting, setStatus);
      }
      resetForm();
      setFileAttachment(null);
      setForwardedBandAttachment(null);
      setForwardedBandAttachmentType(null);
      setMessageToReply(null);
    },
  });

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = memberData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <ScrollView style={{ maxHeight: 100 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={[{ fontSize: 12 }, TextProps]}>{item.name}</Text>
            </Pressable>
          )}
        />
      </ScrollView>
    );
  };

  const resetBandAttachment = () => {
    formik.setFieldValue(`task_id`, "");
    formik.setFieldValue(`task_no`, "");
    formik.setFieldValue(`task_title`, "");
    formik.setFieldValue(`project_id`, "");
    formik.setFieldValue(`project_no`, "");
    formik.setFieldValue(`project_title`, "");
  };

  const resetForwardedBandAttachment = () => {
    forwardedMessageFormik.setFieldValue(`task_id`, "");
    forwardedMessageFormik.setFieldValue(`task_no`, "");
    forwardedMessageFormik.setFieldValue(`task_title`, "");
    forwardedMessageFormik.setFieldValue(`project_id`, "");
    forwardedMessageFormik.setFieldValue(`project_no`, "");
    forwardedMessageFormik.setFieldValue(`project_title`, "");
  };

  const chatMessageHandler = (value) => {
    formik.handleChange("message")(value);
  };

  useEffect(() => {
    formik.setFieldValue("file", fileAttachment ? fileAttachment : "");
  }, [fileAttachment]);

  useEffect(() => {
    forwardedMessageFormik.setFieldValue("file", !forwardedAttachment.name ? "" : forwardedAttachment);
  }, [forwarded_file_name, forwarded_file_path, forwarded_file_size, forwarded_mime_type]);

  useEffect(() => {
    resetBandAttachment();
    if (bandAttachment) {
      formik.setFieldValue(`${bandAttachmentType}_id`, bandAttachment?.id);
      formik.setFieldValue(
        `${bandAttachmentType}_no`,
        bandAttachmentType === "project" ? bandAttachment?.project_no : bandAttachment?.task_no // if task it will send task_no, if other the will send the opposite
      );
      formik.setFieldValue(`${bandAttachmentType}_title`, bandAttachment?.title);
    }
  }, [bandAttachment, bandAttachmentType]);

  /**
   * Handle forwarded band
   */
  useEffect(() => {
    if (forwardedProject) {
      setForwardedBandAttachmentType("project");
      setForwardedBandAttachment(forwardedProject);
    } else if (forwardedTask) {
      setForwardedBandAttachmentType("task");
      setForwardedBandAttachment(forwardedTask);
    }
  }, [forwardedProject, forwardedTask]);

  useEffect(() => {
    if (forwardedBandAttachment) {
      forwardedMessageFormik.setFieldValue(`${forwardedBandAttachmentType}_id`, forwardedBandAttachment?.id);
      forwardedMessageFormik.setFieldValue(
        `${forwardedBandAttachmentType}_no`,
        forwardedBandAttachmentType === "project"
          ? forwardedBandAttachment?.project_no
          : forwardedBandAttachment?.task_no // if task it will send task_no, if other the will send the opposite
      );
      forwardedMessageFormik.setFieldValue(`${forwardedBandAttachmentType}_title`, forwardedBandAttachment?.title);
    }
  }, [forwardedBandAttachment, forwardedBandAttachmentType]);

  /**
   * Handle send forwarded message
   */
  useEffect(() => {
    if (forwardedMessage || forwardedProject || forwardedTask) {
      forwardedMessageFormik.setValues({
        ...forwardedMessageFormik.values,
        message: forwardedMessage || "",
        file: !forwardedAttachment.name ? "" : forwardedAttachment || "",
        project_id: forwardedProject?.id || "",
        project_no: forwardedProject?.project_no || "",
        project_title: forwardedProject?.title || "",
        task_id: forwardedTask?.id || "",
        task_no: forwardedTask?.task_no || "",
        task_title: forwardedTask?.title || "",
      });
      forwardedMessageFormik.handleSubmit();
    }
  }, []);

  return (
    <View>
      <ChatReplyPreview messageToReply={messageToReply} setMessageToReply={setMessageToReply} memberName={memberName} />

      <View style={styles.content}>
        <View style={styles.wrapper}>
          {type === "group" && !active_member ? (
            <Text style={[{ fontSize: 12, textAlign: "center", padding: 10 }, TextProps]}>
              You can't send message to this group because you're no longer a participant
            </Text>
          ) : (
            <>
              <TouchableOpacity
                style={{ marginRight: 1 }}
                onPress={() =>
                  SheetManager.show("form-sheet", {
                    payload: {
                      children: (
                        <View style={{ gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: -20 }}>
                          <View style={{ gap: 1, backgroundColor: "#F5F5F5", borderRadius: 10 }}>
                            {attachmentOptions.map((option, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={option.onPress}
                                  style={[
                                    styles.container,
                                    {
                                      justifyContent: "space-between",
                                      borderBottomWidth: 1,
                                      borderBottomColor: "#FFFFFF",
                                    },
                                  ]}
                                >
                                  <Text style={[{ fontSize: 16 }, TextProps]}>{option.name}</Text>
                                  <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <TouchableOpacity
                            style={[styles.container, { justifyContent: "center" }]}
                            onPress={() => SheetManager.hide("form-sheet")}
                          >
                            <Text style={{ fontSize: 16, fontWeight: "400", color: "#176688" }}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      ),
                    },
                  })
                }
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color="#8A9099"
                  style={{ transform: [{ rotate: "270deg" }] }}
                />
              </TouchableOpacity>

              <View style={{ flex: 1, justifyContent: "center" }}>
                {type === "group" ? (
                  <MentionInput
                    value={formik.values.message}
                    onChange={chatMessageHandler}
                    partTypes={[
                      {
                        pattern:
                          /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                      },
                      {
                        trigger: "@",
                        renderSuggestions: renderSuggestions,
                        textStyle: { fontWeight: "400", color: "#377893" },
                      },
                    ]}
                    placeholder="Type a message..."
                    style={{ padding: 12, paddingTop: Platform.OS === "ios" ? 12 : null, alignItems: "center" }}
                  />
                ) : (
                  <MentionInput
                    containerStyle={{ maxHeight: 100, paddingVertical: Platform.OS === "ios" ? 3 : null }}
                    value={formik.values.message}
                    onChange={(value) => formik.setFieldValue("message", value)}
                    partTypes={[]}
                    placeholder="Type a message..."
                    style={{ padding: 12, paddingTop: Platform.OS === "ios" ? 12 : null, alignItems: "center" }}
                  />
                )}
              </View>

              <MaterialIcons
                onPress={
                  formik.values.message !== "" ||
                  formik.values.file !== "" ||
                  formik.values.project_id ||
                  (formik.values.task_id && !formik.isSubmitting && formik.status !== "processing")
                    ? formik.handleSubmit
                    : null
                }
                style={{
                  opacity: formik.values.message === "" && fileAttachment === null && bandAttachment === null ? 0.5 : 1,
                }}
                name="send"
                size={25}
                color="#8A9099"
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 5,
    gap: 5,
    borderRadius: 10,
  },
});
