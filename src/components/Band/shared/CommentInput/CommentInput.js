import React, { memo, useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";

import { Alert, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Image,
  Pressable,
  Spinner,
  Text,
  TextArea,
  useToast,
} from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import FormButton from "../../../shared/FormButton";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useLoading } from "../../../../hooks/useLoading";

const doc = "../../../../assets/doc-icons/doc-format.png";
const gif = "../../../../assets/doc-icons/gif-format.png";
const key = "../../../../assets/doc-icons/key-format.png";
const other = "../../../../assets/doc-icons/other-format.png";
const pdf = "../../../../assets/doc-icons/pdf-format.png";
const ppt = "../../../../assets/doc-icons/ppt-format.png";
const rar = "../../../../assets/doc-icons/rar-format.png";
const xls = "../../../../assets/doc-icons/xls-format.png";
const zip = "../../../../assets/doc-icons/zip-format.png";

const CommentInput = ({ taskId, projectId, data }) => {
  const userSelector = useSelector((state) => state.auth);
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  const [bulkModeIsOn, setBulkModeIsOn] = useState(false);
  const { isLoading, toggle: toggleLoading } = useLoading(false);

  const { data: comments, refetch: refetchComments } = useFetch(
    projectId ? `/pm/projects/${projectId}/comment` : taskId ? `/pm/tasks/${taskId}/comment` : null
  );
  const { refetch: refetchAttachments } = useFetch(
    projectId ? `/pm/projects/${projectId}/attachment` : taskId ? `/pm/tasks/${taskId}/attachment` : null
  );

  const ownerPrivilage = data?.owner_id === userSelector.id;

  const onDeleteSuccess = () => {
    setBulkModeIsOn(false);
    setSelectedComments([]);
    refetchComments();
    refetchAttachments();
  };

  /**
   * Handle submission of comment for project or task
   * @param {FormData} form - FormData (comment and attachment)
   */
  const submitComment = async (form, setSubmitting, setStatus) => {
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
      setSubmitting(false);
      setStatus("success");

      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Comment added`} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Handle deleteion of comments
   */
  const deleteComments = async () => {
    try {
      toggleLoading();
      for (let i = 0; i < selectedComments.length; i++) {
        if (projectId) {
          await axiosInstance.delete(`/pm/projects/comment/${selectedComments[i]}`);
        } else {
          await axiosInstance.delete(`/pm/tasks/comment/${selectedComments[i]}`);
        }
      }
      onDeleteSuccess();
      toggleLoading();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Comment deleted"} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      toggleLoading();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      task_id: taskId || null,
      project_id: projectId || null,
      comments: "",
    },
    validationSchema: yup.object().shape({
      comments: yup.string().required("Comment can't be empty"),
    }),
    validateOnChange: true,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");

      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      files.map((val) => {
        formData.append("attachment[]", val);
      });

      submitComment(formData, setSubmitting, setStatus);
    },
  });

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
  const downloadAttachment = async (attachment) => {
    try {
      await axiosInstance.get(`/download/${attachment}`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${attachment}`);
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
   * Initialize bulk mode on long press
   */
  const initializeBulkMode = (commentId) => {
    setSelectedComments([commentId]);
    setBulkModeIsOn(true);
    setForceRerender((prev) => !prev);
  };

  /**
   * Handle comment list selections
   */
  const addCommentToArray = (commentId) => {
    setSelectedComments((prevState) => {
      if (!prevState.includes(commentId)) {
        return [...prevState, commentId];
      }
      return prevState;
    });
    setForceRerender((prev) => !prev);
  };

  /**
   * Handle remove comment from selections
   */
  const removeSelectedCommentFromArray = (commentId) => {
    const newCommentArray = selectedComments.filter((comment) => {
      return comment !== commentId;
    });
    setSelectedComments(newCommentArray);
    setForceRerender((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      setFiles([]);
    };
  }, [projectId]);

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  useEffect(() => {
    if (selectedComments.length == 0) {
      setBulkModeIsOn(false);
      setForceRerender((prev) => !prev);
    }
  }, [selectedComments.length]);

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
                      file.type.includes("doc")
                        ? require(doc)
                        : file.type.includes("gif")
                        ? require(gif)
                        : file.type.includes("key")
                        ? require(key)
                        : file.type.includes("pdf")
                        ? require(pdf)
                        : file.type.includes("ppt") || file.type.includes("pptx")
                        ? require(ppt)
                        : file.type.includes("rar")
                        ? require(rar)
                        : file.type.includes("xls") || file.type.includes("xlsx")
                        ? require(xls)
                        : file.type.includes("zip")
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
          <TextArea
            isInvalid={formik.errors.comments}
            variant="unstyled"
            size="md"
            placeholder="Add comment..."
            value={formik.values.comments}
            onChangeText={(value) => formik.setFieldValue("comments", value)}
          />
          <FormControl.ErrorMessage>{formik.errors.comments}</FormControl.ErrorMessage>
        </FormControl>

        <Flex flexDir="row" justifyContent="flex-end" alignItems="center">
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

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit} color="white">
            <Icon
              as={<MaterialCommunityIcons name="send" />}
              style={{ transform: [{ rotate: "-45deg" }] }}
              color="gray.500"
            />
          </FormButton>
        </Flex>
      </Box>

      {/* Comment list */}
      <ScrollView style={{ maxHeight: 300 }}>
        <Box flex={1} minHeight={2}>
          <FlashList
            extraData={forceRerender}
            data={comments?.data}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            estimatedItemSize={200}
            ListHeaderComponent={
              selectedComments.length > 0 && (
                <Box mb={0}>
                  <Button
                    onPress={deleteComments}
                    borderRadius={0}
                    borderTopRadius={8}
                    disabled={isLoading}
                    startIcon={!isLoading && <Icon as={<MaterialCommunityIcons name="delete" />} />}
                    bgColor={isLoading ? "gray.500" : "primary.600"}
                  >
                    {isLoading ? <Spinner color="white" size="sm" /> : <Text color="white">Delete comments</Text>}
                  </Button>
                </Box>
              )
            }
            renderItem={({ item }) => (
              <Pressable
                onLongPress={() => {
                  if (ownerPrivilage || item.user_id === userSelector.id) {
                    !bulkModeIsOn && initializeBulkMode(item.id);
                  }
                }}
                onPress={() => {
                  if (bulkModeIsOn) {
                    if (!selectedComments.includes(item.id)) {
                      addCommentToArray(item.id);
                    } else {
                      removeSelectedCommentFromArray(item.id);
                    }
                  }
                }}
              >
                <Flex
                  flexDir="row"
                  justifyContent="space-between"
                  bgColor={selectedComments.includes(item.id) ? "muted.200" : "white"}
                >
                  <Flex flexDir="row" gap={1.5} mb={2}>
                    <AvatarPlaceholder
                      name={item?.comment_name}
                      image={item?.comment_image}
                      size="xs"
                      style={{ marginTop: 4 }}
                    />

                    <Box>
                      <Flex flexDir="row" gap={1} alignItems="center">
                        <Text>{item?.comment_name.split(" ")[0]}</Text>
                        <Text color="#8A9099">{dayjs(item.comment_time).fromNow()}</Text>
                      </Flex>

                      <Text fontWeight={400}>{item?.comments}</Text>

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
                                onPress={() => downloadAttachment(attachment.file_path)}
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
                </Flex>
              </Pressable>
            )}
          />
        </Box>
      </ScrollView>
    </Flex>
  );
};

export default memo(CommentInput);
