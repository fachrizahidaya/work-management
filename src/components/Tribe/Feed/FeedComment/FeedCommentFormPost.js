import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { MentionInput } from "react-native-controlled-mentions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import FormButton from "../../../shared/FormButton";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const FeedCommentFormPost = ({
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
    <View style={{ ...styles.container }}>
      {/* <AvatarPlaceholder isThumb={false} size="sm" image={loggedEmployeeImage} name={loggedEmployeeName} /> */}
      <View style={{ flex: 1 }}>
        <MentionInput
          value={formik.values.comments}
          onChange={handleChange}
          partTypes={[
            {
              pattern:
                /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
            },
            {
              trigger: "@",
              renderSuggestions: renderSuggestions,
              textStyle: {
                fontWeight: "400",
                color: "#377893",
              },
            },
          ]}
          multiline={false}
          placeholder={parentId ? "Add a reply..." : "Add a comment..."}
          style={{
            alignItems: "center",
          }}
        />
      </View>

      <FormButton
        backgroundColor="white"
        onPress={formik.handleSubmit}
        isSubmitting={formik.isSubmitting}
        opacity={formik.values.comments === "" ? 0.5 : 1}
        padding={5}
        height={40}
        disabled={formik.values.comments === "" ? true : false}
      >
        <MaterialIcons name="send" size={25} color="#8A9099" />
      </FormButton>
    </View>
  );
};

export default FeedCommentFormPost;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 6,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
});
