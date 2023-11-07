import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { Flex, FormControl, Icon, IconButton, Input, Menu, Pressable, Text } from "native-base";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import axiosInstance from "../../../config/api";
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

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (result) {
      setImage({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  // const handleUploadFile = async (formData) => {
  //   try {
  //     // Sending the formData to backend
  //     await axiosInstance.post("/pm/projects/attachment", formData, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     });
  //     // Refetch project's attachments
  //     refetchAttachments();

  //     // Display toast if success
  //     toast.show({
  //       render: ({ id }) => {
  //         return <SuccessToast message={"Attachment uploaded"} close={() => toast.close(id)} />;
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     // Display toast if error
  //     toast.show({
  //       render: ({ id }) => {
  //         return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
  //       },
  //     });
  //   }
  // };

  /**
   * Select file handler
   */
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          // formData format
          const formData = new FormData();
          formData.append("attachment", {
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });
          formData.append("project_id", projectId);

          // Call upload handler and send formData to the api
          // handleUploadFile(formData);
        } else {
          Alert.alert("Max file size is 3MB");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              <Menu.Item onPress={selectFile}>
                <Text>Document</Text>
              </Menu.Item>
              <Menu.Item onPress={pickImageHandler}>
                <Text>Photo</Text>
              </Menu.Item>
              <Menu.Item>
                <Text>Task</Text>
              </Menu.Item>
              <Menu.Item>
                <Text>Project</Text>
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
