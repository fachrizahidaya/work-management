import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Flex, FormControl, Input, Pressable, Text } from "native-base";
import { StyleSheet } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";
import { FlashList } from "@shopify/flash-list";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, onSubmit, loggedEmployeeName, employees }) => {
  const [suggestions, setSuggestions] = useState([]);

  const employeeData = employees.map(({ id, username }) => ({ id, name: username }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

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
    validationSchema: yup.object().shape({
      comments: yup.string().required("Comments is required"),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      onSubmit(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <FormControl style={styles.inputBox} pb={12}>
      <Input
        variant="solid"
        multiline
        onChangeText={(value) => formik.setFieldValue("comments", value)}
        placeholder={parentId ? "Add a reply" : "Add a comment"}
        value={formik.values.comments}
        InputLeftElement={
          <Box pl={1}>
            <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="sm" isThumb={false} />
          </Box>
        }
        InputRightElement={
          <Box pr={0.5} py={0.5}>
            <FormButton
              children={parentId ? "Reply" : "Post"}
              onPress={formik.handleSubmit}
              isSubmitting={formik.isSubmitting}
              opacity={formik.values.comments === "" ? 0.5 : 1}
              variant="unstyled"
              size="sm"
              fontColor="white"
              fontSize={12}
            />
          </Box>
        }
      />
    </FormControl>
  );
};

export default FeedCommentForm;

const styles = StyleSheet.create({
  inputBox: {
    alignItems: "center",
  },
});
