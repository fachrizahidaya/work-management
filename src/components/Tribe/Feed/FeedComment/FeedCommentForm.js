import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { StyleSheet } from "react-native";
import { Box, FormControl, Input } from "native-base";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";
import { useFetch } from "../../../../hooks/useFetch";
import FormButton from "../../../shared/FormButton";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, onSubmit, loggedEmployeeName }) => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const { data: employeeData } = useFetch("/hr/employees");

  /**
   * Create a new post handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      post_id: postId || "",
      comments: "",
      parent_id: parentId || null,
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
    <FormControl alignItems="center" pb={12} paddingBottom={Platform.OS === "ios" && keyboardHeight}>
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
  input: {
    minHeight: 50,
    maxHeight: 100,
    width: 400,
    backgroundColor: "#FFFFFF",
  },
});
