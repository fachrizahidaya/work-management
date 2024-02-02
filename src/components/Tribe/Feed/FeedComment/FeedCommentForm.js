import { useEffect } from "react";

import { StyleSheet, View, Platform } from "react-native";
import { MentionInput } from "react-native-controlled-mentions";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
        placeholder={parentId ? "Add a reply..." : "Add a comment..."}
        style={{
          padding: 5,
          borderRadius: 10,
          width: Platform.OS === "ios" ? 280 : 350,
          borderWidth: 1,
          borderColor: "#DBDBDB",
        }}
      />

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

export default FeedCommentForm;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
