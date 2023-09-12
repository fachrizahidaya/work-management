import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions, Platform } from "react-native";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Select, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import FormButton from "../../../shared/FormButton";

const NewProjectSlider = ({ isOpen, setIsOpen, projectData, refetchSelectedProject }) => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const toast = useToast();

  // State to save editted or created project
  const [projectId, setProjectId] = useState(null);

  const submitHandler = async (form, setSubmitting, setStatus) => {
    try {
      if (!projectData) {
        // Create new project
        const res = await axiosInstance.post("/pm/projects", form);
        // Assign the creator as owner
        axiosInstance.post("/pm/projects/member", {
          project_id: res.data.data.id,
          user_id: res.data.data.owner_id,
        });
        setProjectId(res.data.data.id);
      } else {
        // Edit existing project
        await axiosInstance.patch(`/pm/projects/${projectData.id}`, form);
        setProjectId(projectData.id);

        // Fetch current project's detail again
        refetchSelectedProject();
      }

      // Refetch all project (with current selected status)
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: () => {
          return <SuccessToast message={`Project saved!`} />;
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
    enableReinitialize: true,
    initialValues: {
      title: projectData?.title?.toString() || "",
      priority: projectData?.priority || "",
      deadline: projectData?.deadline || "",
      description: projectData?.description?.toString() || "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Project title is required"),
      priority: yup.string().required("Priority is required"),
      deadline: yup.date().required("Project deadline is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      submitHandler(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      setIsOpen(!isOpen);
      navigation.navigate("Project Detail", { projectId: projectId });
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Project
          </Text>
        </Flex>

        <Flex gap={17} mt={22}>
          <FormControl isInvalid={formik.errors.title}>
            <FormControl.Label>Project Name</FormControl.Label>
            <Input
              value={formik.values.title}
              onChangeText={(value) => formik.setFieldValue("title", value)}
              placeholder="App Development"
            />
            <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.description}>
            <FormControl.Label>Description</FormControl.Label>
            <Input
              value={formik.values.description}
              h={100}
              onChangeText={(value) => formik.setFieldValue("description", value)}
              placeholder="Create a mobile application on iOS and Android devices."
            />
            <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.deadline}>
            <FormControl.Label>End Date</FormControl.Label>
            <CustomDateTimePicker defaultValue={formik.values.deadline} formik={formik} fieldName="deadline" />
            <FormControl.ErrorMessage>{formik.errors.deadline}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.priority}>
            <FormControl.Label>Priority</FormControl.Label>
            <Select
              selectedValue={formik.values.priority}
              onValueChange={(value) => formik.setFieldValue("priority", value)}
              borderRadius={15}
              placeholder="Select priority"
              dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
            >
              <Select.Item label="Low" value="Low" />
              <Select.Item label="Medium" value="Medium" />
              <Select.Item label="High" value="High" />
            </Select>
            <FormControl.ErrorMessage>{formik.errors.priority}</FormControl.ErrorMessage>
          </FormControl>

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text color="white">{projectData ? "Save" : "Create"}</Text>
          </FormButton>
        </Flex>
      </Box>
    </Slide>
  );
};

export default NewProjectSlider;
