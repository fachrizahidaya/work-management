import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions } from "react-native";
import { Box, Flex, Icon, Pressable, Text, FormControl, Input, ScrollView, useToast, Actionsheet } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import CustomSelect from "../../../shared/CustomSelect";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import { useFetch } from "../../../../hooks/useFetch";
import FormButton from "../../../shared/FormButton";
import { useDisclosure } from "../../../../hooks/useDisclosure";

const NewTaskSlider = ({ onClose, taskData, projectId, selectedStatus = "Open", setSelectedTask }) => {
  const toast = useToast();
  const { width, height } = Dimensions.get("window");
  const statuses = ["Low", "Medium", "High"];
  const scores = [1, 2, 3, 4, 5];
  const { isOpen: priorityMenuIsOpen, toggle: togglePriorityMenu } = useDisclosure(false);
  const { isOpen: scoreMenuIsOpen, toggle: toggleScoreMenu } = useDisclosure(false);

  const { refetch: refetchAllTasks } = useFetch(projectId && `/pm/tasks/project/${projectId}`);
  const { refetch: refetchCurrentTask } = useFetch(taskData && `/pm/tasks/${taskData?.id}`);

  const submitHandler = async (form, status, setSubmitting, setStatus) => {
    try {
      if (!taskData) {
        await axiosInstance.post("/pm/tasks", {
          project_id: projectId,
          status: status,
          ...form,
        });
      } else {
        await axiosInstance.patch(`/pm/tasks/${taskData.id}`, form);
        const res = await refetchCurrentTask();
        setSelectedTask(res.data.data);
      }
      setSubmitting(false);
      setStatus("success");

      // Refetch tasks
      refetchAllTasks();

      toast.show({
        render: () => {
          return <SuccessToast message={`Task saved!`} />;
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
      title: taskData?.title || "",
      description: taskData?.description || "",
      deadline: taskData?.deadline || "",
      priority: taskData?.priority || "Low",
      score: taskData?.score || 1,
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required"),
      description: yup.string().max(150, "150 character max").required("Description is required"),
      deadline: yup.date().required("Deadline is required"),
      priority: yup.string().required("Priority is required"),
      score: yup.number().required("Score is required"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      submitHandler(values, selectedStatus, setSubmitting, setStatus);
    },
  });

  const onChangeDeadline = (value) => {
    formik.setFieldValue("deadline", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onClose(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Pressable onPress={() => onClose(formik.resetForm)}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
            </Pressable>
            <Text fontSize={16} fontWeight={500}>
              New Task
            </Text>
          </Flex>

          <Flex gap={17} mt={22}>
            <FormControl isInvalid={formik.errors.title}>
              <FormControl.Label>Task Title</FormControl.Label>
              <Input
                value={formik.values.title}
                onChangeText={(value) => formik.setFieldValue("title", value)}
                placeholder="Input task title..."
              />
              <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.description}>
              <FormControl.Label>Description</FormControl.Label>
              <Input
                value={formik.values.description}
                // multiline
                h={100}
                onChangeText={(value) => formik.setFieldValue("description", value)}
                placeholder="Create a mobile application on iOS and Android devices."
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
              <CustomSelect
                value={formik.values?.priority}
                isOpen={priorityMenuIsOpen}
                toggle={togglePriorityMenu}
                bgColor={"white"}
              >
                {statuses.map((status) => {
                  return (
                    <Actionsheet.Item
                      key={status}
                      onPress={() => {
                        togglePriorityMenu();
                        formik.setFieldValue("priority", status);
                      }}
                    >
                      <Text>{status}</Text>
                    </Actionsheet.Item>
                  );
                })}
              </CustomSelect>
              <FormControl.ErrorMessage>{formik.errors.priority}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.score}>
              <FormControl.Label>Score</FormControl.Label>
              <CustomSelect
                value={formik.values?.score}
                isOpen={scoreMenuIsOpen}
                toggle={toggleScoreMenu}
                bgColor={"white"}
              >
                {scores.map((score) => {
                  return (
                    <Actionsheet.Item
                      key={score}
                      onPress={() => {
                        toggleScoreMenu();
                        formik.setFieldValue("priority", score);
                      }}
                    >
                      <Text>{score}</Text>
                    </Actionsheet.Item>
                  );
                })}
              </CustomSelect>
              <FormControl.ErrorMessage>{formik.errors.score}</FormControl.ErrorMessage>
            </FormControl>

            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text color="white">{taskData ? "Save" : "Create"}</Text>
            </FormButton>
          </Flex>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default NewTaskSlider;
