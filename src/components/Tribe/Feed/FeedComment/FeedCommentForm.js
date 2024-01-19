import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { StyleSheet, View, Pressable, Text } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, onSubmit, loggedEmployeeName, employees }) => {
  const [suggestions, setSuggestions] = useState([]);

  const employeeData = employees.map(({ id, username }) => ({ id, name: username }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <View style={{ height: 200 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const handleChange = (value) => {
    formik.handleChange("comments")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue.split(" ").pop();
    setSuggestions(employees.filter((employee) => employee.name.toLowerCase().includes(lastWord.toLowerCase())));
  };

  /**
   * Create a new post handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      post_id: postId || "",
      comments: "",
      parent_id: parentId || "",
    },
    // validationSchema: yup.object().shape({
    //   comments: yup.string().required("Comments is required"),
    // }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
      const modifiedContent = values.comments.replace(mentionRegex, "@$1");
      values.comments = modifiedContent;
      onSubmit(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <View style={{ ...styles.container }}>
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
        style={{ padding: 5, borderRadius: 10, width: 320, borderWidth: 1, borderColor: "#DBDBDB", height: 40 }}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
});
