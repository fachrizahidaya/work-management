import React from "react";
import * as FileSystem from "expo-file-system";
import * as Share from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, FormControl, Icon, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AttachmentList from "./AttachmentList/AttachmentList";
import { useFetch } from "../../../../../hooks/useFetch";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";

const AttachmentSection = ({ taskId }) => {
  const toast = useToast();
  const { data: attachments, refetch: refetchAttachments } = useFetch(taskId && `/pm/tasks/${taskId}/attachment`);

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
        res = await axiosInstance.get(`/pm/tasks/comment/attachment/${attachmentId}/download`);
      } else {
        res = await axiosInstance.get(`/pm/tasks/attachment/${attachmentId}/download`);
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

  const handleUploadFile = async (formData) => {
    try {
      // Sending the formData to backend
      await axiosInstance.post("/pm/tasks/attachment", formData, {
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
          formData.append("task_id", projectId);

          // Call upload handler and send formData to the api
          handleUploadFile(formData);
        } else {
          Alert.alert("Max file size is 3MB");
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
        await axiosInstance.delete(`/pm/tasks/comment/attachment/${attachmentId}`);
      } else {
        await axiosInstance.delete(`/pm/tasks/attachment/${attachmentId}`);
      }
      // Refetch attachments after deletion
      refetchAttachments();

      // If the deleted attachment is from comment
      // Then refetch comments
      if (attachmentFrom === "Comment") {
        refetchComments();
      }

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
    <Flex gap={2}>
      <FormControl>
        <FormControl.Label>ATTACHMENTS</FormControl.Label>
        <ScrollView style={{ maxHeight: 200 }}>
          <Box flex={1} minHeight={2}>
            <FlashList
              data={attachments?.data}
              keyExtractor={(item) => item?.id}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <AttachmentList
                  id={item?.id}
                  title={item?.file_name}
                  size={item?.file_size}
                  time={item?.uploaded_at}
                  type={item?.mime_type}
                  from={item?.attachment_from}
                  deleteFileHandler={deleteFileHandler}
                  downloadFileHandler={downloadAttachment}
                />
              )}
            />
          </Box>
        </ScrollView>
      </FormControl>

      <TouchableOpacity onPress={selectFile}>
        <Flex flexDir="row" alignItems="center" gap={3}>
          <Icon as={<MaterialCommunityIcons name="plus" />} color="blue.600" size="md" />
          <Text color="blue.600">Add attachment</Text>
        </Flex>
      </TouchableOpacity>
    </Flex>
  );
};

export default AttachmentSection;
