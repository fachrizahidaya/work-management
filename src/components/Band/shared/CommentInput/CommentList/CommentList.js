import React, { memo, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import RenderHTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Pressable, Spinner, Text, useToast } from "native-base";
import { Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import { useLoading } from "../../../../../hooks/useLoading";
import { hyperlinkConverter } from "../../../../../helpers/hyperlinkConverter";

const CommentList = ({ comments, parentData, refetchComments, refetchAttachments, downloadAttachment, projectId }) => {
  const toast = useToast();
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

  const baseStyles = {
    color: "#3F434A",
    fontWeight: 500,
  };

  useEffect(() => {
    if (selectedComments.length == 0) {
      setBulkModeIsOn(false);
      setForceRerender((prev) => !prev);
    }
  }, [selectedComments.length]);
  return (
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
              <Flex
                flexDir="row"
                justifyContent="space-between"
                bgColor={selectedComments.includes(item.id) ? "muted.200" : "white"}
              >
                <Flex flexDir="row" gap={1.5} mb={2} flex={1}>
                  <AvatarPlaceholder
                    name={item?.comment_name}
                    image={item?.comment_image}
                    size="xs"
                    style={{ marginTop: 4 }}
                  />

                  <Box flex={1}>
                    <Flex flexDir="row" gap={1} alignItems="center">
                      <Text>{item?.comment_name.split(" ")[0]}</Text>
                      <Text color="#8A9099">{dayjs(item.comment_time).fromNow()}</Text>
                    </Flex>

                    <Box>
                      <RenderHTML
                        contentWidth={width}
                        baseStyle={baseStyles}
                        source={{
                          html: hyperlinkConverter(item?.comments) || "",
                        }}
                      />
                    </Box>

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
  );
};

export default memo(CommentList);
