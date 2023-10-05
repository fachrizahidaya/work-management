import { useFormik } from "formik";
import * as yup from "yup";

import { StyleSheet } from "react-native";
import { Box, Button, FormControl, Input, KeyboardAvoidingView } from "native-base";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";
import { useFetch } from "../../../../hooks/useFetch";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, inputRef, onSubmit, loggedEmployeeName }) => {
  const { data: employees } = useFetch("/hr/employees");

  /**
   * Form comments Handler
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
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  return (
    <FormControl alignItems="center" pb={12}>
      <Input
        variant="solid"
        multiline
        onChangeText={(value) => formik.setFieldValue("comments", value)}
        placeholder={parentId ? "Add a reply" : "Add a comment"}
        value={formik.values.comments}
        InputLeftElement={
          <Box pl={1}>
            <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="sm" />
          </Box>
        }
        InputRightElement={
          <Button
            opacity={formik.values.comments === "" ? 0.5 : 1}
            variant="unstyled"
            size="sm"
            onPress={formik.handleSubmit}
          >
            {parentId ? "Reply" : "Post"}
          </Button>
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
    backgroundColor: "white",
  },
});
