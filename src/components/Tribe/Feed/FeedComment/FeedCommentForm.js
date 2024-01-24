import { useEffect, useState } from "react";

import { StyleSheet, View, Pressable, Text, Platform } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";

const FeedCommentForm = ({
  loggedEmployeeImage,
  parentId,
  loggedEmployeeName,
  renderSuggestions,
  handleChange,
  formik,
  suggestion,
}) => {
  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <View style={{ ...styles.container, alignItems: suggestion.length > 0 ? "center" : "flex-end" }}>
      <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="sm" isThumb={false} />

      <MentionInput
        value={formik.values.comments}
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
        multiline
        placeholder="Type here..."
        style={{
          padding: 5,
          borderRadius: 10,
          width: Platform.OS === "ios" ? 280 : 320,
          borderWidth: 1,
          borderColor: "#DBDBDB",
        }}
      />

      <FormButton
        onPress={formik.handleSubmit}
        isSubmitting={formik.isSubmitting}
        opacity={formik.values.comments === "" ? 0.5 : 1}
        padding={5}
        height={40}
        disabled={formik.values.comments === "" ? true : false}
      >
        <Text style={{ color: "#FFFFFF" }}>{parentId ? "Reply" : "Post"}</Text>
      </FormButton>
    </View>
  );
};

export default FeedCommentForm;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
  },
});
