import { Avatar, Box, Button, Flex, FormControl, Icon, Input, Pressable } from "native-base";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import axiosInstance from "../../../../config/api";
import { useEffect } from "react";

const FeedCommentForm = ({ postId, loggedEmployeeImage, parentId, inputRef, onSubmit }) => {
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
    <Flex flexDir="row" gap={0} mt={1}>
      <Avatar size="sm" source={{ uri: `https://dev.kolabora-app.com/api-dev/image/${loggedEmployeeImage}/thumb` }} />
      <Box>
        <FormControl isInvalid={formik.errors.comments}>
          <Input
            backgroundColor="white"
            variant="unstyled"
            borderWidth={1}
            borderRadius={15}
            // multiline
            minH={100}
            maxH={200}
            width={300}
            onChangeText={(value) => formik.setFieldValue("comments", value)}
            placeholder="Type something"
            textAlignVertical="top"
            value={formik.values.comments}
          />
          <FormControl.ErrorMessage>{formik.errors.comments}</FormControl.ErrorMessage>
          <Button alignSelf="flex-end" width={100} size="md" onPress={formik.handleSubmit}>
            Send
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default FeedCommentForm;
