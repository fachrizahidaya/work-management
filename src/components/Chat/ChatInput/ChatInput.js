import { useEffect, useState } from "react";
import { useFormik } from "formik";

import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../shared/Forms/Input";
import ChatReplyPreview from "./ChatReplyPreview";
import { TextProps } from "../../shared/CustomStylings";

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
  groupMember,
  selectFile,
  pickImageHandler,
  navigation,
  name,
  image,
  position,
  email,
  isPinned,
  memberName,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const attachmentOptions = [
    {
      icon: "file-document-outline",
      name: "Document",
      color: "#1E4AB9",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        selectFile();
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        pickImageHandler();
      },
    },
    {
      icon: "circle-slice-2",
      name: "Project/Task",
      color: "#EB0E29",
      onPress: () => {
        navigation.navigate("Project Screen", {
          bandAttachment: bandAttachment,
          setBandAttachment: setBandAttachment,
          bandAttachmentType: bandAttachmentType,
          setBandAttachmentType: setBandAttachmentType,
          userId: userId,
          name: name,
          roomId: roomId,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          isPinned: isPinned,
        });
        SheetManager.hide("form-sheet");
      },
    },
  ];

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
      <View style={{ height: 200 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={[{ fontSize: 12 }, TextProps]}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
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
    <View>
      <ChatReplyPreview
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
        type={type}
        memberName={memberName}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F8F8F8",
            paddingHorizontal: 5,
            gap: 5,
            borderRadius: 10,
          }}
        >
          {type === "group" && !active_member ? (
            <Text style={[{ fontSize: 12, textAlign: "center", padding: 10 }, TextProps]}>
              You can't send message to this group because you're no longer a participant
            </Text>
          ) : (
            <>
              <Pressable
                style={{ marginRight: 1 }}
                onPress={() =>
                  SheetManager.show("form-sheet", {
                    payload: {
                      children: (
                        <View
                          style={{
                            display: "flex",
                            gap: 21,
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            marginBottom: 40,
                          }}
                        >
                          <View style={{ gap: 5 }}>
                            {attachmentOptions.map((option, index) => {
                              return (
                                <TouchableOpacity key={index} onPress={option.onPress} style={styles.container}>
                                  <Text style={[{ fontSize: 16 }, TextProps]}>{option.name}</Text>
                                  <MaterialCommunityIcons name={option.icon} color={option.color} size={20} />
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <TouchableOpacity
                            style={{ alignItems: "center", justifyContent: "center" }}
                            onPress={() => SheetManager.hide("form-sheet")}
                          >
                            <Text style={{ fontSize: 16, fontWeight: "400", color: "#176688" }}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      ),
                    },
                  })
                }
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color="#8A9099"
                  style={{ transform: [{ rotate: "270deg" }] }}
                />
              </Pressable>

              <View style={{ display: "flex", flex: 1, justifyContent: "center" }}>
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
                    style={{
                      padding: 12,
                      height: 45,
                      // borderWidth: 1,
                      // borderColor: "#CBCBCB",
                      // borderRadius: 10
                    }}
                  />
                ) : (
                  <Input
                    placeHolder="Type a message..."
                    value={formik.values.message}
                    onChangeText={(value) => formik.setFieldValue("message", value)}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={
                  formik.values.message !== "" ||
                  formik.values.file !== "" ||
                  formik.values.project_id ||
                  (formik.values.task_id && !formik.isSubmitting && formik.status !== "processing")
                    ? formik.handleSubmit
                    : null
                }
                opacity={formik.values.message === "" && fileAttachment === null && bandAttachment === null ? 0.5 : 1}
              >
                <MaterialIcons name="send" size={25} color="#8A9099" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
