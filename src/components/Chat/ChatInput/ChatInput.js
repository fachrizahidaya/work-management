import { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Flex, FormControl, Icon, IconButton, Input, Menu, Modal, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { FlashList } from "@shopify/flash-list";
import ProjectAttachment from "../Attachment/ProjectAttachment";
import TaskAttachment from "../Attachment/TaskAttachment";

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
}) => {
  const { isOpen: taskListIsOpen, toggle: toggleTaskList } = useDisclosure(false);
  const { isOpen: projectListIsOpen, toggle: toggleProjectList } = useDisclosure(false);
  const formik = useFormik({
    initialValues: {
      to_user_id: userId || "",
      group_id: userId || "",
      reply_to_id: messageToReply || "",
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
      // )
      // {
      //   const formData = new FormData();
      //   for (let key in values) {
      //     formData.append(key, values[key]);
      //   }
      //   formData.append("message", values.message.replace(/(<([^>]+)>)/gi, ""));
      //   setStatus("processing");
      //   if (type === "personal") {
      //     formData.delete("group_id", null);
      //   } else {
      //     formData.delete("to_user_id", null);
      //   }
      // }
      sendMessage(values, setSubmitting, setStatus);
      resetForm();
      setFileAttachment(null);
      setBandAttachment(null);
      setBandAttachmentType(null);
      setMessageToReply(null);
    },
    enableReinitialize: true,
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
    <>
      <FormControl justifyContent="center" borderTopWidth={1} borderColor="#E8E9EB" px={2}>
        <Input
          h={60}
          size="xl"
          variant="unstyled"
          placeholder="Type a message..."
          multiline={true}
          value={formik.values.message}
          onChangeText={(value) => formik.setFieldValue("message", value)}
          InputLeftElement={
            <Flex direction="row" justifyContent="space-between" px={2}>
              <Menu
                w={160}
                mb={7}
                trigger={(trigger) => {
                  return fileAttachment ? null : (
                    <Pressable {...trigger} mr={1}>
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
            </Flex>
          }
          InputRightElement={
            <IconButton
              onPress={formik.handleSubmit}
              opacity={formik.values.message === "" && fileAttachment === null ? 0.5 : 1}
              icon={<Icon as={<MaterialIcons name="send" />} size={6} />}
            />
          }
        />
      </FormControl>
    </>
  );
};

export default ChatInput;
