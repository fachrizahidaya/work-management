import { useEffect, useState } from "react";
import { useFormik } from "formik";

import { Box, Flex, FormControl, Icon, IconButton, Input, Pressable, Text } from "native-base";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ChatReplyPreview from "./ChatReplyPreview";

const ChatInput = ({
  userId,
  roomId,
  type,
  fileAttachment,
  onSendMessage,
  setFileAttachment,
  bandAttachment,
  setBandAttachment,
  bandAttachmentType,
  setBandAttachmentType,
  messageToReply,
  setMessageToReply,
  active_member,
  toggleMenu,
  groupMember,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const memberData = groupMember.map((item) => ({
    id: item?.user?.id,
    name: item?.user?.name,
  }));
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      to_user_id: type === "personal" ? userId : null || "",
      group_id: type === "group" ? roomId : null || "",
      reply_to_id: messageToReply?.id || "",
      message: "",
      file: "",
      project_id: "",
      project_no: "",
      project_title: "",
      task_id: "",
      task_no: "",
      task_title: "",
    },

    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      if (
        formik.values.message !== "" ||
        formik.values.file !== "" ||
        formik.values.project_id !== "" ||
        formik.values.task_id !== ""
      ) {
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        formData.append("message", values.message.replace(/(<([^>]+)>)/gi, ""));
        setStatus("processing");
        onSendMessage(formData, setSubmitting, setStatus);
      }
      resetForm();
      setFileAttachment(null);
      setBandAttachment(null);
      setBandAttachmentType(null);
      setMessageToReply(null);
    },
  });

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = memberData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <Box height={200}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text>{item.name}</Text>
            </Pressable>
          )}
        />
      </Box>
    );
  };

  const resetBandAttachment = () => {
    formik.setFieldValue(`task_id`, "");
    formik.setFieldValue(`task_no`, "");
    formik.setFieldValue(`task_title`, "");
    formik.setFieldValue(`project_id`, "");
    formik.setFieldValue(`project_no`, "");
    formik.setFieldValue(`project_title`, "");
  };

  const handleChange = (value) => {
    formik.handleChange("message")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue.split(" ").pop();
    setSuggestions(groupMember.filter((member) => member?.name?.toLowerCase().includes(lastWord.toLowerCase())));
  };

  useEffect(() => {
    formik.setFieldValue("file", fileAttachment ? fileAttachment : "");
  }, [fileAttachment]);

  useEffect(() => {
    resetBandAttachment();
    if (bandAttachment) {
      formik.setFieldValue(`${bandAttachmentType}_id`, bandAttachment?.id);
      formik.setFieldValue(
        `${bandAttachmentType}_no`,
        bandAttachmentType === "project" ? bandAttachment?.project_no : bandAttachment?.task_no // if task it will send task_no, if other the will send the opposite
      );
      formik.setFieldValue(`${bandAttachmentType}_title`, bandAttachment?.title);
    }
  }, [bandAttachment, bandAttachmentType]);

  return (
    <Box>
      <ChatReplyPreview messageToReply={messageToReply} setMessageToReply={setMessageToReply} type={type} />

      <Flex backgroundColor="#FFFFFF" flexDirection="row" alignItems="center" justifyContent="center" p={2}>
        <Flex
          borderRadius={10}
          px={1}
          backgroundColor="#F8F8F8"
          gap={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {type === "group" && !active_member ? (
            <Text textAlign="center" fontSize={12} fontWeight={500}>
              You can't send message to this group because you're no longer a participant
            </Text>
          ) : (
            <>
              <Pressable onPress={toggleMenu}>
                <Icon
                  as={<MaterialCommunityIcons name="plus" />}
                  size={6}
                  style={{ transform: [{ rotate: "270deg" }] }}
                  color="#8A9099"
                />
              </Pressable>

              <FormControl display="flex" flex={1} justifyContent="center">
                {type === "group" ? (
                  <MentionInput
                    value={formik.values.message}
                    onChange={handleChange}
                    partTypes={[
                      {
                        pattern:
                          /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                        textStyle: { color: "blue" },
                      },
                      {
                        trigger: "@",
                        renderSuggestions: renderSuggestions,
                      },
                    ]}
                    placeholder="Type a message..."
                    style={{ padding: 12 }}
                  />
                ) : (
                  <Input
                    size="md"
                    variant="unstyled"
                    placeholder="Type a message..."
                    value={formik.values.message}
                    onChangeText={(value) => formik.setFieldValue("message", value)}
                  />
                )}
              </FormControl>

              <IconButton
                onPress={
                  formik.values.message !== "" ||
                  formik.values.file !== "" ||
                  formik.values.project_id ||
                  (formik.values.task_id && !formik.isSubmitting && formik.status !== "processing")
                    ? formik.handleSubmit
                    : null
                }
                opacity={formik.values.message === "" && fileAttachment === null && bandAttachment === null ? 0.5 : 1}
                icon={<Icon as={<MaterialIcons name="send" />} size={6} color="#8A9099" />}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatInput;
