import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Flex, FormControl, Icon, IconButton, Input, Menu, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import axiosInstance from "../../../config/api";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ChatInput = ({ userId }) => {
  const { isOpen: attachmentIsOpen, toggle: toggleAttachment } = useDisclosure(false);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  /**
   * Handles submission of chat message
   * @param {Object} form - message to submit
   */
  const sendMessage = async (form, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post("/chat/personal/message", {
        to_user_id: userId,
        ...form,
      });
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
    <FormControl borderTopWidth={1} borderColor="#E8E9EB" px={2}>
      <Input
        h={73}
        size="2xl"
        variant="unstyled"
        placeholder="Type a message..."
        value={formik.values.message}
        onChangeText={(value) => formik.setFieldValue("message", value)}
        InputLeftElement={
          <Flex direction="row" justifyContent="space-between" px={2} gap={4}>
            {/* <Pressable>
              <Icon
                as={<MaterialIcons name={"attach-file"} />}
                size={6}
                style={{ transform: [{ rotate: "45deg" }] }}
                color="#8A9099"
              />
            </Pressable> */}
            <Menu
              w={160}
              mb={7}
              trigger={(trigger) => {
                return (
                  <Pressable {...trigger} mr={1}>
                    <Icon
                      as={<MaterialIcons name="add" />}
                      size={6}
                      // style={{ transform: [{ rotate: "45deg" }] }}
                      color="#8A9099"
                    />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={toggleAttachment}>
                <Text>Document</Text>
              </Menu.Item>
              <Menu.Item onPress={toggleAttachment}>
                <Text>Photo</Text>
              </Menu.Item>
            </Menu>

            {/* <Pressable>
              <Icon as={<MaterialIcons name={"insert-emoticon"} />} size={6} color="#8A9099" />
            </Pressable> */}
          </Flex>
        }
        InputRightElement={
          <IconButton
            mx={3}
            bgColor="#176688"
            size="md"
            borderRadius="full"
            onPress={formik.handleSubmit}
            icon={
              <Icon as={<MaterialIcons name="send" />} color="white" style={{ transform: [{ rotate: "-35deg" }] }} />
            }
          />
        }
      />
    </FormControl>
  );
};

export default ChatInput;
