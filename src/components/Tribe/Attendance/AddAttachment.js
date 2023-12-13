import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";

import { Actionsheet, Box, FormControl, Input, Pressable, Text, VStack } from "native-base";
import { Platform } from "react-native";

import FormButton from "../../shared/FormButton";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";

const AddAttachment = ({ isOpen, toggle, onSelectFile, fileAttachment, setFileAttachment, onSubmit }) => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();
  const formik = useFormik({
    initialValues: {
      title: "",
      begin_date: "",
      end_date: "",
      attachment: fileAttachment?.name || "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required"),
      begin_date: yup.date().required("Start date is required"),
      end_date: yup
        .date()
        .required("End date is required")
        .min(yup.ref("begin_date"), "End date can't be less than start date"),
      attachment: yup.mixed().required("Attachment file is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      onSubmit(formData, setSubmitting, setStatus);
    },
  });

  /**
   * Begin and End date Leave handler
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      toggle();
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  useEffect(() => {
    formik.setFieldValue("attachment", fileAttachment ? fileAttachment : "");
  }, [fileAttachment]);

  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={() => {
        formik.resetForm();
        setFileAttachment(null);
        toggle();
      }}
    >
      <Actionsheet.Content>
        <VStack w="95%" space={3} pb={Platform.OS === "ios" && keyboardHeight}>
          <VStack w="100%" space={2}>
            <FormControl.Label>Title</FormControl.Label>

            <FormControl isInvalid={formik.errors.title}>
              <Input
                variant="outline"
                type="text"
                placeholder="Input title"
                value={formik.values.title}
                onChangeText={(value) => formik.setFieldValue("title", value)}
              />
              <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl display="flex" flexDirection="row" justifyContent="space-between">
              <Box>
                <FormControl.Label>Start Date</FormControl.Label>
                <CustomDateTimePicker
                  width={180}
                  defaultValue={formik.values.begin_date}
                  onChange={onChangeStartDate}
                />
                <FormControl.ErrorMessage>{formik.errors.begin_date}</FormControl.ErrorMessage>
              </Box>
              <Box>
                <FormControl.Label>End Date</FormControl.Label>
                <CustomDateTimePicker width={180} defaultValue={formik.values.end_date} onChange={onChangeEndDate} />
                <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage>
              </Box>
            </FormControl>

            <FormControl.Label>Attachment</FormControl.Label>

            <FormControl isInvalid={formik.errors.attachment}>
              <Pressable onPress={onSelectFile} p={3} borderColor="" borderRadius={15} borderWidth={1}>
                <Text fontSize={12} fontWeight={400} opacity={0.5}>
                  {!fileAttachment ? "Upload file..." : fileAttachment?.name}
                </Text>
              </Pressable>
              <FormControl.ErrorMessage>{formik.errors.attachment}</FormControl.ErrorMessage>
            </FormControl>

            {!formik.values.attachment ? (
              <FormButton opacity={0.5} disabled={true} children="Submit" fontColor="white" />
            ) : (
              <FormButton
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
                children="Submit"
                fontColor="white"
              />
            )}
          </VStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default AddAttachment;
