import { Avatar, Button, FormControl, Input, Pressable } from "native-base";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosInstance from "../../../../config/api";
import { useEffect } from "react";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, inputRef, onSubmit, loggedEmployeeName }) => {
  const [employees, setEmployees] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      comments: "",
      post_id: postId || "",
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
        backgroundColor="white"
        variant="unstyled"
        multiline
        minH={50}
        maxH={100}
        width={400}
        onChangeText={(value) => formik.setFieldValue("comments", value)}
        placeholder="Type something"
        textAlignVertical="top"
        value={formik.values.comments}
        InputRightElement={
          <Button size="md" onPress={formik.handleSubmit}>
            Post
          </Button>
        }
      />
      <FormControl.ErrorMessage>{formik.errors.comments}</FormControl.ErrorMessage>
    </FormControl>
  );
};

export default FeedCommentForm;
