import React, { memo } from "react";
import * as DocumentPicker from "expo-document-picker";

import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-root-toast";

import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AttachmentList from "./AttachmentList/AttachmentList";
import { useFetch } from "../../../../../hooks/useFetch";
import axiosInstance from "../../../../../config/api";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../../../shared/CustomStylings";

const AttachmentSection = ({ taskId, disabled }) => {
  const { data: attachments, refetch: refetchAttachments } = useFetch(taskId && `/pm/tasks/${taskId}/attachment`);

  /**
   * Handles downloading attachment
   * Read file's base64 format and saving it to the user's selected directory
   * @param {string} attachmentId - ID of the file
   * @param {string} attachmentName - File name
   * @param {string} attachmentFrom - Description of the file's origin (Comment or Project)
   */
  const downloadAttachment = async (attachment) => {
    try {
      await axiosInstance.get(`/download/${attachment}`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${attachment}`);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
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

      Toast.show("Attachment uploaded", SuccessToastProps);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
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
          formData.append("task_id", taskId);

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
      SheetManager.hide("form-sheet");
      // Refetch attachments after deletion
      refetchAttachments();

      // If the deleted attachment is from comment
      // Then refetch comments
      if (attachmentFrom === "Comment") {
        refetchComments();
      }

      Toast.show("Attachment deleted", SuccessToastProps);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };
  return (
    <View style={{ display: "flex", gap: 10 }}>
      <View style={{ display: "flex", gap: 10 }}>
        <Text style={[{ fontWeight: 500 }, TextProps]}>ATTACHMENTS</Text>

        {attachments?.data?.length > 0 && (
          <View style={{ flex: 1 }}>
            <FlashList
              data={attachments.data}
              keyExtractor={(item) => item.id}
              estimatedItemSize={221}
              horizontal
              renderItem={({ item }) => (
                <AttachmentList
                  id={item?.id}
                  title={item.file_name}
                  size={item.file_size}
                  time={item.uploaded_at}
                  type={item.mime_type}
                  from={item.attachment_from}
                  deleteFileHandler={deleteFileHandler}
                  downloadFileHandler={downloadAttachment}
                  path={item.file_path}
                  disabled={disabled}
                />
              )}
            />
          </View>
        )}
      </View>

      <TouchableOpacity onPress={selectFile}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialCommunityIcons name="plus" size={20} color="#304FFD" />
          <Text style={{ fontWeight: 500, color: "#304FFD" }}>Add attachment</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(AttachmentSection);
