import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Share from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import { useFormik } from "formik";
import * as yup from "yup";

import { PermissionsAndroid, Alert, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Image,
  Input,
  Pressable,
  Text,
  useToast,
} from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";

const doc = "../../../../assets/doc-icons/doc-format.png";
const gif = "../../../../assets/doc-icons/gif-format.png";
const key = "../../../../assets/doc-icons/key-format.png";
const other = "../../../../assets/doc-icons/other-format.png";
const pdf = "../../../../assets/doc-icons/pdf-format.png";
const ppt = "../../../../assets/doc-icons/ppt-format.png";
const rar = "../../../../assets/doc-icons/rar-format.png";
const xls = "../../../../assets/doc-icons/xls-format.png";
const zip = "../../../../assets/doc-icons/zip-format.png";

const CommentInput = ({ taskId, projectId }) => {
  const toast = useToast();
  const [files, setFiles] = useState([]);

  const { data: comments, refetch: refetchComments } = useFetch(`/pm/projects/${projectId}/comment`);
  const { refetch: refetchAttachments } = useFetch(`/pm/projects/${projectId}/attachment`);

  /**
   * Handle submission of comment for project or task
   * @param {FormData} form - FormData (comment and attachment)
   */
  const submitComment = async (form) => {
    try {
      // Checking current comment is from project or task
      let apiURL = "";
      if (projectId) {
        apiURL = "/pm/projects/comment";
      } else if (taskId) {
        apiURL = "/pm/tasks/comment";
      }

      await axiosInstance.post(apiURL, form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      // Refetch all comments after success submission
      refetchComments();
      refetchAttachments();
      setFiles([]);

      toast.show({
        render: () => {
          return <SuccessToast message={`Comment added`} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      task_id: taskId || null,
      project_id: projectId || null,
      comments: "",
    },
    validationSchema: yup.object().shape({
      comments: yup.string().required("Comment can't be empty"),
    }),
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      files.map((val) => {
        formData.append("attachment[]", val);
      });

      submitComment(formData);
      resetForm();
    },
  });

  /**
   * Handle deletion comment
   * @param {string} commentId - id to delete
   */
  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/pm/projects/comment/${commentId}`);
      refetchComments();
      refetchAttachments();
      toast.show({
        render: () => {
          return <SuccessToast message={`Comment deleted`} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  /**
   * Check permission (Android only)
   * @returns {Boolean} - This function returns true or false
   * after checking the android permission
   */
  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

      if (!result) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
          title: "You need to give storage permission to download and save the file",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          return true;
        } else {
          Alert.alert("Error", I18n.t("PERMISSION_ACCESS_FILE"));

          console.log("Camera permission denied");
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  /**
   * Select file handler
   */
  const selectFile = async () => {
    try {
      if (Platform.OS === "android") {
        // Check permission first for android
        const androidPermission = await checkPermissions();

        if (androidPermission) {
          const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false,
          });

          // Check if there is selected file
          if (result) {
            if (result.assets[0].size < 3000001) {
              if (!files) {
                setFiles([
                  {
                    name: result.assets[0].name,
                    size: result.assets[0].size,
                    type: result.assets[0].mimeType,
                    uri: result.assets[0].uri,
                    webkitRelativePath: "",
                  },
                ]);
              } else {
                setFiles([
                  ...files,
                  {
                    name: result.assets[0].name,
                    size: result.assets[0].size,
                    type: result.assets[0].mimeType,
                    uri: result.assets[0].uri,
                    webkitRelativePath: "",
                  },
                ]);
              }
            } else {
              Alert.alert("Max file size is 3MB");
            }
          }
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
        });

        // Check if there is selected file
        if (result) {
          if (result.assets[0].size < 3000001) {
            if (!files) {
              setFiles([result.assets[0]]);
            } else {
              setFiles([...files, result.assets[0]]);
            }
          } else {
            Alert.alert("Max file size is 3MB");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Remove file handler
   */
  const removeFile = (index) => {
    const updatedFiles = files.filter((file, idx) => idx !== index);
    setFiles(updatedFiles);
  };

  /**
   * Download Attachment
   */
  const downloadAttachment = async (attachmentId, attachmentName) => {
    try {
      let apiURL = "";
      if (projectId) {
        apiURL = `/pm/projects/comment/attachment/${attachmentId}/download`;
      } else if (taskId) {
        apiURL = `/pm/tasks/comment/attachment/${attachmentId}/download`;
      }
      const res = await axiosInstance.get(apiURL);
      const base64Code = res.data.file.split(",")[1];
      const fileName = FileSystem.documentDirectory + attachmentName;
      await FileSystem.writeAsStringAsync(fileName, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.shareAsync(fileName);
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      setFiles([]);
    };
  }, [projectId]);

  return (
    <Flex gap={5}>
      {/* Render selected attachments here */}
      {files.length > 0 && (
        <Flex flexDir="row" gap={1} flexWrap="wrap">
          {files.map((file, idx) => {
            // If file is image : render the image uri
            if (file.type.includes("image")) {
              return (
                <Pressable key={idx} onPress={() => removeFile(idx)}>
                  <Image alt="file" source={{ uri: file.uri }} h={60} w={60} />
                </Pressable>
              );
            } else {
              // Else if file is other than image : render the extension image logo
              return (
                <Pressable key={idx} onPress={() => removeFile(idx)}>
                  <Image
                    alt="file"
                    source={
                      file.mimeType.includes("doc")
                        ? require(doc)
                        : file.mimeType.includes("gif")
                        ? require(gif)
                        : file.mimeType.includes("key")
                        ? require(key)
                        : file.mimeType.includes("pdf")
                        ? require(pdf)
                        : file.mimeType.includes("ppt") || file.mimeType.includes("pptx")
                        ? require(ppt)
                        : file.mimeType.includes("rar")
                        ? require(rar)
                        : file.mimeType.includes("xls") || file.mimeType.includes("xlsx")
                        ? require(xls)
                        : file.mimeType.includes("zip")
                        ? require(zip)
                        : require(other)
                    }
                    h={60}
                    w={60}
                  />
                </Pressable>
              );
            }
          })}

          <Text fontSize={10} opacity={0.5} alignSelf="center">
            Tap item to remove
          </Text>
        </Flex>
      )}
      <Box borderWidth={1} borderRadius={10} borderColor="gray.300" p={2}>
        <FormControl>
          <Input
            isInvalid={formik.errors.comments}
            variant="unstyled"
            placeholder="Add comment..."
            multiline
            h={20}
            onChangeText={(value) => formik.setFieldValue("comments", value)}
          />
          <FormControl.ErrorMessage>{formik.errors.comments}</FormControl.ErrorMessage>
        </FormControl>

        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Button onPress={formik.handleSubmit}>Comment</Button>

          <Flex flexDir="row" alignItems="center" gap={1}>
            <IconButton
              size="sm"
              borderRadius="full"
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="attachment" />}
                  color="gray.500"
                  size="lg"
                  style={{ transform: [{ rotate: "-35deg" }] }}
                />
              }
              onPress={selectFile}
            />
          </Flex>
        </Flex>
      </Box>

      {/* Comment list */}
      <ScrollView style={{ maxHeight: 400 }}>
        <Box flex={1} minHeight={2}>
          <FlashList
            data={comments?.data}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            estimatedItemSize={200}
            renderItem={({ item }) => (
              <Flex flexDir="row" alignItems="center" justifyContent="space-between">
                <Flex flexDir="row" alignItems="center" gap={1.5} mb={2}>
                  <Avatar
                    size="xs"
                    source={{
                      uri: `https://dev.kolabora-app.com/api-dev/image/${item.comment_image}/thumb`,
                    }}
                  />

                  <Box>
                    <Flex flexDir="row" gap={1} alignItems="center">
                      <Text>{item?.comment_name}</Text>
                      <Text color="#8A9099">{dayjs(item.comment_time).fromNow()}</Text>
                    </Flex>

                    <Text>{item?.comments}</Text>

                    <Flex flexDir="row" alignItems="center" gap={1} flexWrap="wrap">
                      {item.attachments.length > 0 &&
                        item.attachments.map((attachment) => {
                          return (
                            <Pressable
                              key={attachment.id}
                              borderWidth={1}
                              borderColor="#8A9099"
                              borderRadius={10}
                              p={1}
                              onPress={() => downloadAttachment(attachment.id, attachment.file_name)}
                            >
                              <Text>
                                {attachment.file_name.length > 15
                                  ? attachment.file_name.slice(0, 15)
                                  : attachment.file_name}
                              </Text>
                            </Pressable>
                          );
                        })}
                    </Flex>
                  </Box>
                </Flex>

                <Pressable mr={5} onPress={() => deleteComment(item.id)}>
                  <Icon as={<MaterialCommunityIcons name="tooltip-remove-outline" />} color="red.600" />
                </Pressable>
              </Flex>
            )}
          />
        </Box>
      </ScrollView>
    </Flex>
  );
};

export default CommentInput;
