import React from "react";
import * as FileSystem from "expo-file-system";
import * as Share from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { ScrollView } from "react-native-gesture-handler";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Box, Flex, Icon, Image, Menu, Pressable, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";

const doc = "../../../../assets/doc-icons/doc-format.png";
const gif = "../../../../assets/doc-icons/gif-format.png";
const jpg = "../../../../assets/doc-icons/jpg-format.png";
const key = "../../../../assets/doc-icons/key-format.png";
const other = "../../../../assets/doc-icons/other-format.png";
const pdf = "../../../../assets/doc-icons/pdf-format.png";
const png = "../../../../assets/doc-icons/png-format.png";
const ppt = "../../../../assets/doc-icons/ppt-format.png";
const rar = "../../../../assets/doc-icons/rar-format.png";
const xls = "../../../../assets/doc-icons/xls-format.png";
const zip = "../../../../assets/doc-icons/zip-format.png";

const FileSection = ({ projectId, projectData }) => {
  const toast = useToast();

  const { data: attachments, refetch: refetchAttachments } = useFetch(`/pm/projects/${projectId}/attachment`);

  /**
   * Handles downloading attachment
   * Read file's base64 format and saving it to the user's selected directory
   * @param {string} attachmentId - ID of the file
   * @param {string} attachmentName - File name
   * @param {string} attachmentFrom - Description of the file's origin (Comment or Project)
   */
  const downloadAttachment = async (attachmentId, attachmentName, attachmentFrom) => {
    try {
      let res;
      if (attachmentFrom === "Comment") {
        res = await axiosInstance.get(`/pm/projects/comment/attachment/${attachmentId}/download`);
      } else {
        res = await axiosInstance.get(`/pm/projects/attachment/${attachmentId}/download`);
      }
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

  const handleUploadFile = async (formData) => {
    try {
      // Sending the formData to backend
      await axiosInstance.post("/pm/projects/attachment", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      // Refetch project's attachments
      refetchAttachments();

      // Display toast if success
      toast.show({
        render: () => {
          return <SuccessToast message={"Attachment uploaded"} />;
        },
      });
    } catch (error) {
      console.log(error);
      // Display toast if error
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
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
            // type: "image/*",
          });

          // Check if there is selected file
          if (result) {
            // formData format
            const formData = new FormData();
            formData.append("attachment", result.assets[0]);
            formData.append("project_id", projectId);

            // Call upload handler and send formData to the api
            handleUploadFile(formData);
          }
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          // type: "image/*",
        });

        // Check if there is selected file
        if (result) {
          // formData format
          const formData = new FormData();
          formData.append("attachment", result.assets[0]);
          formData.append("project_id", projectId);

          // Call upload handler and send formData to the api
          handleUploadFile(formData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Delete file handler
   * @param {string} attachmentId - Attachment id to delete
   * @param {string} attachmentFrom - Attachment origin (Comment or Project)
   */
  const deleteFileHandler = async (attachmentId, attachmentFrom) => {
    try {
      if (attachmentFrom === "Comment") {
        await axiosInstance.delete(`/pm/projects/comment/attachment/${attachmentId}`);
      } else {
        await axiosInstance.delete(`/pm/projects/attachment/${attachmentId}`);
      }
      // Refetch attachments after deletion
      refetchAttachments();

      toast.show({
        render: () => {
          return <SuccessToast message={"Attachment deleted"} />;
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

  return (
    <Flex style={{ gap: 18 }}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text fontSize={16}>FILES</Text>

        <Pressable
          bg="#f1f2f3"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius={10}
          onPress={selectFile}
        >
          <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
        </Pressable>
      </Flex>

      <ScrollView style={{ maxHeight: 200 }}>
        <Box flex={1} minHeight={2}>
          <FlashList
            data={attachments?.data}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.1}
            estimatedItemSize={200}
            renderItem={({ item }) => (
              <Flex
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                pr={1.5}
                style={{ marginBottom: 14 }}
              >
                <Flex flexDir="row" alignItems="center" style={{ gap: 21 }}>
                  <Image
                    resizeMode="contain"
                    source={
                      item?.mime_type.includes("doc")
                        ? require(doc)
                        : item?.mime_type.includes("gif")
                        ? require(gif)
                        : item?.mime_type.includes("jpg") || item?.mime_type.includes("jpeg")
                        ? require(jpg)
                        : item?.mime_type.includes("key")
                        ? require(key)
                        : item?.mime_type.includes("pdf")
                        ? require(pdf)
                        : item?.mime_type.includes("png")
                        ? require(png)
                        : item?.mime_type.includes("ppt") || item?.mime_type.includes("pptx")
                        ? require(ppt)
                        : item?.mime_type.includes("rar")
                        ? require(rar)
                        : item?.mime_type.includes("xls") || item?.mime_type.includes("xlsx")
                        ? require(xls)
                        : item?.mime_type.includes("zip")
                        ? require(zip)
                        : require(other)
                    }
                    alt="file_icon"
                    style={{ height: 40, width: 31 }}
                  />
                  <Box>
                    <Text fontSize={12} fontWeight={400}>
                      {item?.file_name.length > 30 ? item?.file_name.slice(0, 30) + "..." : item?.file_name}
                    </Text>
                    <Text fontSize={11} fontWeight={400} color="#8A9099">
                      {item?.file_size}
                    </Text>
                  </Box>
                </Flex>

                <Menu
                  trigger={(triggerProps) => {
                    return (
                      <Pressable {...triggerProps}>
                        <Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" />
                      </Pressable>
                    );
                  }}
                >
                  <Menu.Item onPress={() => downloadAttachment(item?.id, item?.file_name, item?.attachment_from)}>
                    <Flex flexDir="row" alignItems="center" gap={2}>
                      <Icon as={<MaterialCommunityIcons name="download-outline" />} size="md" />
                      <Text>Download</Text>
                    </Flex>
                  </Menu.Item>

                  <Menu.Item onPress={() => deleteFileHandler(item?.id, item?.attachment_from)}>
                    <Flex flexDir="row" alignItems="center" gap={2}>
                      <Icon as={<MaterialCommunityIcons name="delete-outline" />} size="md" color="red.600" />
                      <Text color="red.500">Delete</Text>
                    </Flex>
                  </Menu.Item>
                </Menu>
              </Flex>
            )}
          />
        </Box>
      </ScrollView>
    </Flex>
  );
};

export default FileSection;
