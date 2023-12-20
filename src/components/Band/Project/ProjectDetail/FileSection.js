import React, { memo } from "react";
import * as DocumentPicker from "expo-document-picker";

import { ScrollView } from "react-native-gesture-handler";
import { Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import AttachmentList from "../../Task/TaskDetail/AttachmentSection/AttachmentList/AttachmentList";

const FileSection = ({ projectId, isAllowed }) => {
  const {
    data: attachments,
    isLoading: attachmentIsLoading,
    refetch: refetchAttachments,
  } = useFetch(`/pm/projects/${projectId}/attachment`);
  const { refetch: refetchComments } = useFetch(`/pm/projects/${projectId}/comment`);

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
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
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
      Toast.show({
        type: "success",
        text1: "Attachment uploaded",
      });
    } catch (error) {
      console.log(error);
      // Display toast if error
      Toast.show({
        type: "error",
        text1: error.response.data.message,
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
          formData.append("project_id", projectId);

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
        await axiosInstance.delete(`/pm/projects/comment/attachment/${attachmentId}`);
      } else {
        await axiosInstance.delete(`/pm/projects/attachment/${attachmentId}`);
      }
      // Refetch attachments after deletion
      refetchAttachments();

      // If the deleted attachment is from comment
      // Then refetch comments
      if (attachmentFrom === "Comment") {
        refetchComments();
      }

      Toast.show({
        type: "success",
        text1: "Attachment deleted",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  return (
    <View style={{ display: "flex", gap: 18 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>FILES</Text>

        <TouchableOpacity
          onPress={selectFile}
          style={{
            backgroundColor: "#f1f2f3",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            borderRadius: 10,
          }}
        >
          <MaterialCommunityIcons name="plus" size={20} />
        </TouchableOpacity>
      </View>
      {!attachmentIsLoading && (
        <>
          {attachments?.data?.length > 0 ? (
            <ScrollView style={{ maxHeight: 200 }}>
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlashList
                  data={attachments.data}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <AttachmentList
                      deleteFileHandler={deleteFileHandler}
                      downloadFileHandler={downloadAttachment}
                      from={item?.attachment_from}
                      iconHeight={39}
                      iconWidth={31}
                      id={item.id}
                      size={item.file_size}
                      title={item.file_name}
                      type={item.mime_type}
                      path={item.file_path}
                      disabled={!isAllowed}
                    />
                  )}
                />
              </View>
            </ScrollView>
          ) : (
            <View style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image
                alt="no-attachment"
                source={require("../../../../assets/vectors/no-file.jpg")}
                style={{ height: 100, width: 140, resizeMode: "contain" }}
              />
              <Text style={{ fontWeight: 400 }}>This project has no attachment</Text>
            </View>
          )}
        </>
      )}

      <Toast position="bottom" />
    </View>
  );
};

export default memo(FileSection);
