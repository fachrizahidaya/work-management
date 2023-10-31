import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Flex, FormControl, Icon, IconButton, Input, Pressable } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import axiosInstance from "../../../config/api";

const ChatInput = ({ opponentId }) => {
  /**
   * Handles submission of chat message
   * @param {Object} form - message to submit
   */
  const sendMessage = async (form, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post("/chat/personal/message", {
        to_user_id: opponentId,
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
    <FormControl borderTopWidth={1} borderColor="#E8E9EB" px={4}>
      <Input
        h={73}
        size="2xl"
        variant="unstyled"
        placeholder="Type a message..."
        value={formik.values.message}
        onChangeText={(value) => formik.setFieldValue("message", value)}
        InputLeftElement={
          <Flex direction="row" justifyContent="space-between" px={2} gap={4}>
            <Pressable>
              <Icon
                as={<MaterialIcons name={"attach-file"} />}
                size={6}
                style={{ transform: [{ rotate: "45deg" }] }}
                color="#8A9099"
              />
            </Pressable>

            <Pressable>
              <Icon as={<MaterialIcons name={"insert-emoticon"} />} size={6} color="#8A9099" />
            </Pressable>
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
