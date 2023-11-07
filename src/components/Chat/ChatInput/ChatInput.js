import { useState, useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Flex, FormControl, Icon, IconButton, Input, Menu, Pressable, Text } from "native-base";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axiosInstance from "../../../config/api";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ImageAttachment from "../Attachment/ImageAttachment";

const ChatInput = ({ userId, imageAttachment, type, fileAttachment, selectFile, pickImageHandler }) => {
  /**
   * Handles submission of chat message
   * @param {Object} form - message to submit
   */
  const sendMessage = async (form, setSubmitting, setStatus) => {
    try {
      if (typeof userId === "number") {
        await axiosInstance.post(`/chat/${type}/message`, {
          to_user_id: userId,
          ...form,
        });
      } else if (typeof userId === "string") {
        await axiosInstance.post(`/chat/${type}/message`, {
          group_id: userId,
          ...form,
        });
      }
      setSubmitting(false);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: "",
    },
    validationSchema: yup.object().shape({
      message: yup.string().required("Message can't be empty"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      sendMessage(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <>
      <FormControl borderTopWidth={1} borderColor="#E8E9EB" px={2}>
        <Input
          h={70}
          size="xl"
          variant="unstyled"
          placeholder="Type a message..."
          multiline={true}
          value={formik.values.message}
          onChangeText={(value) => formik.setFieldValue("message", value)}
          InputLeftElement={
            <Flex direction="row" justifyContent="space-between" px={2} gap={4}>
              <Menu
                w={160}
                mb={7}
                trigger={(trigger) => {
                  return fileAttachment || imageAttachment ? null : (
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
                <Menu.Item>
                  <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} />
                  <Text>Project</Text>
                </Menu.Item>
                <Menu.Item>
                  <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />} />
                  <Text>Task</Text>
                </Menu.Item>
              </Menu>
            </Flex>
          }
          InputRightElement={
            <IconButton
              onPress={formik.handleSubmit}
              opacity={formik.values.message === "" && imageAttachment === null && fileAttachment === null ? 0.5 : 1}
              icon={<Icon as={<MaterialIcons name="send" />} size={6} />}
            />
          }
        />
      </FormControl>
    </>
  );
};

export default ChatInput;
