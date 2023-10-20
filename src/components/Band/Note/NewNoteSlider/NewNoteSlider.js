import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Box, Flex, Icon, Pressable, Text, FormControl, Input, useToast, TextArea } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import FormButton from "../../../shared/FormButton";
import useCheckAccess from "../../../../hooks/useCheckAccess";

const NewNoteSlider = ({ isOpen, onClose, noteData, refresh, refreshFunc = true }) => {
  const toast = useToast();
  const { width, height } = Dimensions.get("window");
  const editCheckAccess = useCheckAccess("update", "Notes");

  const submitHandler = async (form, setSubmitting, setStatus) => {
    try {
      if (noteData?.id) {
        await axiosInstance.patch(`/pm/notes/${noteData.id}`, form);
      } else {
        await axiosInstance.post("/pm/notes", form);
      }
      if (refreshFunc) {
        refresh();
      }

      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: () => {
          return <SuccessToast message={"Note saved"} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: noteData ? true : false,
    initialValues: {
      title: noteData?.title || "",
      content: noteData?.content || "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Note title is required"),
      content: yup.string().required("Content is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      submitHandler({ ...values, pinned: noteData ? noteData.pinned : false }, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onClose(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    isOpen && (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box position="absolute" zIndex={3}>
          <Box w={width} height={height} bgColor="white" p={5}>
            <Flex flexDir="row" alignItems="center" gap={2}>
              <Pressable onPress={() => onClose(formik.resetForm)}>
                <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
              </Pressable>
              <Text fontSize={16} fontWeight={500}>
                New Note
              </Text>
            </Flex>

            <Flex gap={17} mt={22}>
              <FormControl isInvalid={formik.errors.title}>
                <FormControl.Label>Title</FormControl.Label>
                <Input
                  value={formik.values.title}
                  onChangeText={(value) => formik.setFieldValue("title", value)}
                  placeholder="The title of a note"
                />
                <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.content}>
                <FormControl.Label>Content</FormControl.Label>
                <TextArea
                  h={200}
                  value={formik.values.content}
                  onChangeText={(value) => formik.setFieldValue("content", value)}
                  placeholder="Create a mobile application on iOS and Android devices."
                />
                <FormControl.ErrorMessage>{formik.errors.content}</FormControl.ErrorMessage>
              </FormControl>

              {editCheckAccess && (
                <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                  <Text color="white">{noteData ? "Save" : "Create"}</Text>
                </FormButton>
              )}
            </Flex>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    )
  );
};

export default NewNoteSlider;
