import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Flex, FormControl, Icon, IconButton, Input, Menu, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import ProjectAttachment from "../Attachment/ProjectAttachment";
import TaskAttachment from "../Attachment/TaskAttachment";
import ChatReplyPreview from "./ChatReplyPreview";

const ChatInput = ({
  userId,
  type,
  fileAttachment,
  selectFile,
  pickImageHandler,
  sendMessage,
  setFileAttachment,
  bandAttachment,
  setBandAttachment,
  bandAttachmentType,
  setBandAttachmentType,
  messageToReply,
  setMessageToReply,
  active_member,
}) => {
  const { isOpen: taskListIsOpen, toggle: toggleTaskList } = useDisclosure(false);
  const { isOpen: projectListIsOpen, toggle: toggleProjectList } = useDisclosure(false);

  const attachmentOptions = [
    {
      icon: "file-document-outline",
      name: "Document",
      onPress: () => selectFile(),
    },
    {
      icon: "image",
      name: "Photo",
      onPress: () => pickImageHandler(),
    },
    {
      icon: "lightning-bolt",
      name: "Project",
      onPress: () => selectBandHandler("project"),
    },
    {
      icon: "checkbox-marked-circle-outline",
      name: "Task",
      onPress: () => selectBandHandler("task"),
    },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      to_user_id: userId || "",
      group_id: userId || "",
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

    onSubmit: (values, { setSubmitting, setStatus }) => {
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
        sendMessage(formData, setSubmitting, setStatus);
      }
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

  const bandAttachmentSelectHandler = (attachment) => {
    setBandAttachment(attachment);
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
      formik.setFieldValue(`${bandAttachmentType}_no`, bandAttachment?.number_id);
      formik.setFieldValue(`${bandAttachmentType}_title`, bandAttachment?.title);
    }
  }, [bandAttachment, bandAttachmentType]);

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Box>
      <ChatReplyPreview messageToReply={messageToReply} setMessageToReply={setMessageToReply} type={type} />

      <Flex gap={1} backgroundColor="#E8E9EB" flexDirection="row" alignItems="center" p={2}>
        {type === "group" && !active_member ? (
          <Text textAlign="center" fontSize={12} fontWeight={500}>
            You can't send message to this group because you're no longer a participant
          </Text>
        ) : (
          <>
            <Menu
              trigger={(trigger) => {
                return fileAttachment || bandAttachment ? null : (
                  <Pressable {...trigger}>
                    <Icon
                      as={<MaterialCommunityIcons name="attachment" />}
                      size={6}
                      style={{ transform: [{ rotate: "270deg" }] }}
                    />
                  </Pressable>
                );
              }}
            >
              {attachmentOptions.map((option) => {
                return (
                  <Menu.Item onPress={option.onPress}>
                    <Icon as={<MaterialCommunityIcons name={option.icon} />} />
                    <Text>{option.name}</Text>
                  </Menu.Item>
                );
              })}
            </Menu>
            <FormControl display="flex" flex={1} justifyContent="center">
              <Input
                backgroundColor="#FFFFFF"
                size="md"
                variant="unstyled"
                placeholder="Type a message..."
                multiline={true}
                value={formik.values.message}
                onChangeText={(value) => formik.setFieldValue("message", value)}
              />
            </FormControl>
            <IconButton
              onPress={
                formik.values.message !== "" ||
                formik.values.file !== "" ||
                formik.values.project_id ||
                formik.values.task_id
                  ? formik.handleSubmit
                  : null
              }
              opacity={formik.values.message === "" && fileAttachment === null && bandAttachment === null ? 0.5 : 1}
              icon={<Icon as={<MaterialIcons name="send" />} size={6} />}
            />
          </>
        )}
      </Flex>

      <ProjectAttachment
        projectListIsOpen={projectListIsOpen}
        toggleProjectList={toggleProjectList}
        bandAttachmentType={bandAttachmentType}
        setBandAttachmentType={setBandAttachmentType}
        onSelectBandAttachment={bandAttachmentSelectHandler}
        bandAttachment={bandAttachment}
        setBandAttachment={setBandAttachment}
      />

      <TaskAttachment
        taskListIsOpen={taskListIsOpen}
        toggleTaskList={toggleTaskList}
        bandAttachmentType={bandAttachmentType}
        setBandAttachmentType={setBandAttachmentType}
        onSelectBandAttachment={bandAttachmentSelectHandler}
        bandAttachment={bandAttachment}
        setBandAttachment={setBandAttachment}
      />
    </Box>
  );
};

export default ChatInput;
