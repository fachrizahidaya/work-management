import { Button, FormControl, Input, Pressable } from "native-base";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosInstance from "../../../../config/api";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, inputRef, onSubmit, loggedEmployeeName }) => {
  const [employees, setEmployees] = useState([]);

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

  const fetchEmployee = async () => {
    try {
      const res = await axiosInstance.get("/hr/employees");
      setEmployees(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <FormControl
      alignItems="center"
      pt={2}
      pb={52}
      borderTopWidth={1}
      borderColor="#E8E9EB"
      isInvalid={formik.errors.comments}
    >
      <Input
        variant="unstyled"
        multiline
        onChangeText={(value) => formik.setFieldValue("comments", value)}
        placeholder={parentId ? "Add a reply" : "Add a comment"}
        textAlignVertical="top"
        value={formik.values.comments}
        style={styles.input}
        InputRightElement={
          <Button size="md" onPress={formik.handleSubmit}>
            Send
          </Button>
        }
      />
      <FormControl.ErrorMessage>{formik.errors.comments}</FormControl.ErrorMessage>
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
