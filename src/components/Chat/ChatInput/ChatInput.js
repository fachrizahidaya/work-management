import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Flex, FormControl, Icon, IconButton, Input, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ChatReplyPreview from "./ChatReplyPreview";

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
  toggleProjectList,
  toggleTaskList,
  toggleMenu,
}) => {
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

  const selectBandHandler = (bandType) => {
    if (bandType === "project") {
      toggleProjectList();
    } else {
      toggleTaskList();
    }
    setBandAttachmentType(bandType);
  };

  const resetBandAttachment = () => {
    formik.setFieldValue(`task_id`, "");
    formik.setFieldValue(`task_no`, "");
    formik.setFieldValue(`task_title`, "");
    formik.setFieldValue(`project_id`, "");
    formik.setFieldValue(`project_no`, "");
    formik.setFieldValue(`project_title`, "");
  };

  useEffect(() => {
    formik.setFieldValue("file", fileAttachment ? fileAttachment : "");
  }, [fileAttachment]);

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

  return (
    <Box>
      <ChatReplyPreview messageToReply={messageToReply} setMessageToReply={setMessageToReply} type={type} />

      <Flex backgroundColor="#FFFFFF" flexDirection="row" alignItems="center" justifyContent="center" p={2}>
        <Flex
          borderRadius={10}
          px={1}
          backgroundColor="#F8F8F8"
          gap={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {type === "group" && !active_member ? (
            <Text textAlign="center" fontSize={12} fontWeight={500}>
              You can't send message to this group because you're no longer a participant
            </Text>
          ) : (
            <>
              <Pressable onPress={toggleMenu}>
                <Icon
                  as={<MaterialCommunityIcons name="plus" />}
                  size={6}
                  style={{ transform: [{ rotate: "270deg" }] }}
                  color="#8A9099"
                />
              </Pressable>

              <FormControl display="flex" flex={1} justifyContent="center">
                <Input
                  size="md"
                  variant="unstyled"
                  placeholder="Type a message..."
                  value={formik.values.message}
                  onChangeText={(value) => formik.setFieldValue("message", value)}
                />
              </FormControl>

              <IconButton
                onPress={
                  formik.values.message !== "" ||
                  formik.values.file !== "" ||
                  formik.values.project_id ||
                  (formik.values.task_id && !formik.isSubmitting && formik.status !== "processing")
                    ? formik.handleSubmit
                    : null
                }
                opacity={formik.values.message === "" && fileAttachment === null && bandAttachment === null ? 0.5 : 1}
                icon={<Icon as={<MaterialIcons name="send" />} size={6} color="#8A9099" />}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatInput;
