import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Box, Flex, Icon, Text, FormControl, Input, Select, useToast, TextArea } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import FormButton from "../../../shared/FormButton";
import PageHeader from "../../../shared/PageHeader";

const NewProjectSlider = ({ onClose, projectData, refetchSelectedProject, teamMembers }) => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const toast = useToast();

  // State to save editted or created project
  const [projectId, setProjectId] = useState(null);

  const submitHandler = async (form, setSubmitting, setStatus) => {
    try {
      if (!projectData) {
        const res = await axiosInstance.post("/pm/projects", form);
        // Creating project from My Team screen
        // Bulk invite teams to project
        if (teamMembers) {
          for (let i = 0; i < teamMembers.length; i++) {
            await axiosInstance.post("/pm/projects/member", {
              project_id: res.data.data.id,
              user_id: teamMembers[i].user_id,
            });
          }
        } else {
          // Assign the creator as owner
          axiosInstance.post("/pm/projects/member", {
            project_id: res.data.data.id,
            user_id: res.data.data.owner_id,
          });
        }
        setProjectId(res.data.data.id);
      } else {
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

  const onChangeDeadline = (value) => {
    formik.setFieldValue("deadline", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onClose(formik.resetForm);
      navigation.navigate("Project Detail", { projectId: projectId });
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Box position="absolute" zIndex={3}>
        <Box w={width} height={height} bgColor="white" p={5}>
          <PageHeader title="New Project" onPress={() => onClose(formik.resetForm)} />

          <Flex gap={17} mt={22}>
            <FormControl isInvalid={formik.errors.title}>
              <FormControl.Label>Project Name</FormControl.Label>
              <Input
                value={formik.values.title}
                onChangeText={(value) => formik.setFieldValue("title", value)}
                placeholder="Input project title..."
              />
              <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.description}>
              <FormControl.Label>Description</FormControl.Label>
              <TextArea
                value={formik.values.description}
                onChangeText={(value) => formik.setFieldValue("description", value)}
                placeholder="Input project description..."
              />
              <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.deadline}>
              <FormControl.Label>End Date</FormControl.Label>
              <CustomDateTimePicker defaultValue={formik.values.deadline} onChange={onChangeDeadline} />
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
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default NewProjectSlider;
