import React, { memo, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import RenderHTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Dimensions, Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import axiosInstance from "../../../../../config/api";
import { useLoading } from "../../../../../hooks/useLoading";
import { hyperlinkConverter } from "../../../../../helpers/hyperlinkConverter";
import Button from "../../../../shared/Forms/Button";

const CommentList = ({ comments, parentData, refetchComments, refetchAttachments, downloadAttachment, projectId }) => {
  const { width } = Dimensions.get("screen");
  const userSelector = useSelector((state) => state.auth);
  const [selectedComments, setSelectedComments] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  const [bulkModeIsOn, setBulkModeIsOn] = useState(false);
  const { isLoading, toggle: toggleLoading } = useLoading(false);
  const ownerPrivilage = parentData?.owner_id === userSelector.id;

  const onDeleteSuccess = () => {
    setBulkModeIsOn(false);
    setSelectedComments([]);
    refetchComments();
    refetchAttachments();
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
      Toast.show({
        type: "success",
        text1: "Comment deleted",
      });
    } catch (error) {
      console.log(error);
      toggleLoading();
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  const baseStyles = {
    color: "#000",
    fontWeight: 400,
  };

  useEffect(() => {
    if (selectedComments.length == 0) {
      setBulkModeIsOn(false);
      setForceRerender((prev) => !prev);
    }
  }, [selectedComments.length]);
  return (
    <ScrollView style={{ maxHeight: 300 }}>
      <View style={{ flex: 1, minHeight: 2 }}>
        <FlashList
          extraData={forceRerender}
          data={comments?.data}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.1}
          estimatedItemSize={42}
          ListHeaderComponent={
            selectedComments.length > 0 && (
              <View style={{ marginBottom: 0 }}>
                <Button onPress={deleteComments} styles={{ borderTopRadius: 8 }} disabled={isLoading}>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {!isLoading && <MaterialCommunityIcons name="delete" size={20} color="white" />}
                    {isLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={{ color: "white", fontWeight: 500 }}>Delete comments</Text>
                    )}
                  </View>
                </Button>
              </View>
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
                  if (ownerPrivilage || item.user_id === userSelector.id) {
                    if (!selectedComments.includes(item.id)) {
                      addCommentToArray(item.id);
                    } else {
                      removeSelectedCommentFromArray(item.id);
                    }
                  }
                }
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: selectedComments.includes(item.id) ? "#F8F8F8" : "white",
                }}
              >
                <View style={{ display: "flex", flexDirection: "row", gap: 10, marginBottom: 8, flex: 1 }}>
                  <AvatarPlaceholder
                    name={item?.comment_name}
                    image={item?.comment_image}
                    size="xs"
                    style={{ marginTop: 4 }}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
                      <Text style={{ fontWeight: 500 }}>{item?.comment_name.split(" ")[0]}</Text>
                      <Text style={{ fontWeight: 500, color: "#8A9099" }}>{dayjs(item.comment_time).fromNow()}</Text>
                    </View>

                    <View>
                      <RenderHTML
                        contentWidth={width}
                        baseStyle={baseStyles}
                        source={{
                          html: hyperlinkConverter(item?.comments) || "",
                        }}
                      />
                    </View>

                    <View
                      style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, flexWrap: "wrap" }}
                    >
                      {item.attachments.length > 0 &&
                        item.attachments.map((attachment) => {
                          return (
                            <Pressable
                              key={attachment.id}
                              style={{ borderWidth: 1, borderColor: "#8A9099", borderRadius: 10, padding: 2 }}
                              onPress={() => downloadAttachment(attachment.file_path)}
                            >
                              <Text style={{ fontWeight: 500 }}>
                                {attachment.file_name.length > 15
                                  ? attachment.file_name.slice(0, 15)
                                  : attachment.file_name}
                              </Text>
                            </Pressable>
                          );
                        })}
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
      <Toast position="bottom" />
    </ScrollView>
  );
};

export default memo(CommentList);
