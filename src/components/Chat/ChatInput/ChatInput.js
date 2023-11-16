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

    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      // if (
      //   formik.values.message !== "" ||
      //   formik.values.file !== "" ||
      //   formik.values.project_id !== "" ||
      //   formik.values.task_id !== ""
      // ) {
      //   const formData = new FormData();
      //   for (let key in values) {
      //     formData.append(key, values[key]);
      //   }
      //   formData.append("message", values.message.replace(/(<([^>]+)>)/gi, ""));
      //   setStatus("processing");
      //   if (type === "group") {
      //     formData.set("to_user_id", null);
      //     sendMessage(formData, setSubmitting, setStatus);
      //   } else {
      //     formData.set("group_id", null);
      //     sendMessage(formData, setSubmitting, setStatus);
      //   }
      // }
      sendMessage(values, setSubmitting, setStatus);
      resetForm();
      setFileAttachment(null);
      setBandAttachment(null);
      setBandAttachmentType(null);
      setMessageToReply(null);
    },
  });

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
      formik.setFieldValue(`${bandAttachmentType.toLowerCase()}_id`, bandAttachment?.id);
      formik.setFieldValue(`${bandAttachmentType.toLowerCase()}_no`, bandAttachment?.number_id);
      formik.setFieldValue(`${bandAttachmentType.toLowerCase()}_title`, bandAttachment?.title);
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
      {type === "group" && !active_member ? (
        <Flex flexDirection="row" alignItems="center" justifyContent="center" py={1} backgroundColor="#E8E9EB" px={3}>
          <Text textAlign="center" fontSize={12} fontWeight={500}>
            You can't send message to this group because you're no longer a participant
          </Text>
        </Flex>
      ) : (
        <FormControl
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          py={1}
          backgroundColor="#E8E9EB"
          px={3}
        >
          <Menu
            w={160}
            mb={7}
            trigger={(trigger) => {
              return fileAttachment ? null : (
                <Pressable {...trigger}>
                  <Icon as={<MaterialIcons name="add" />} size={6} />
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={selectFile}>
              <Icon as={<MaterialCommunityIcons name="file-document-outline" />} />
              <Text>Document</Text>
            </Menu.Item>
            <Menu.Item onPress={pickImageHandler}>
              <Icon as={<MaterialIcons name="photo" />} />
              <Text>Photo</Text>
            </Menu.Item>
            <Menu.Item onPress={toggleProjectList}>
              <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} />
              <Text>Project</Text>
            </Menu.Item>
            <Menu.Item onPress={toggleTaskList}>
              <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />} />
              <Text>Task</Text>
            </Menu.Item>
          </Menu>

          <ProjectAttachment
            projectListIsOpen={projectListIsOpen}
            toggleProjectList={toggleProjectList}
            bandAttachmentType={bandAttachmentType}
            setBandAttachmentType={setBandAttachmentType}
            onSelectBandAttachment={bandAttachmentSelectHandler}
          />

          <TaskAttachment
            taskListIsOpen={taskListIsOpen}
            toggleTaskList={toggleTaskList}
            bandAttachmentType={bandAttachmentType}
            setBandAttachmentType={setBandAttachmentType}
            onSelectBandAttachment={bandAttachmentSelectHandler}
          />

          <Input
            backgroundColor="#FFFFFF"
            maxHeight={100}
            width={300}
            size="md"
            variant="unstyled"
            placeholder="Type a message..."
            multiline={true}
            value={formik.values.message}
            onChangeText={(value) => formik.setFieldValue("message", value)}
          />

          <IconButton
            onPress={formik.values.message === "" ? null : formik.handleSubmit}
            opacity={formik.values.message === "" && fileAttachment === null ? 0.5 : 1}
            icon={<Icon as={<MaterialIcons name="send" />} size={6} />}
          />
        </FormControl>
      )}
    </Box>
  );
};

export default ChatInput;
