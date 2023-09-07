import React, { useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions, Platform } from "react-native";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Button, Menu, ScrollView } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import CustomSelect from "../../../shared/CustomSelect";

const NewTaskSlider = ({ isOpen, setIsOpen, task, submitHandler }) => {
  const { width, height } = Dimensions.get("window");
  const [openSelect, setOpenSelect] = useState(false);
  const [openScore, setOpenScore] = useState(false);
  const statuses = ["Low", "Medium", "High"];
  const scores = [1, 2, 3, 4, 5];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      deadline: task?.deadline || "",
      priority: task?.priority || "Low",
      score: task?.score || 1,
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
      submitHandler(values, task?.id, "Open", setSubmitting, setStatus);
    },
  });

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Pressable onPress={() => setIsOpen(!isOpen)}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
            </Pressable>
            <Text fontSize={16} fontWeight={500}>
              New Task
            </Text>
          </Flex>

          <Flex gap={17} mt={22}>
            <FormControl isInvalid={formik.errors.title}>
              <FormControl.Label>Task Title</FormControl.Label>
              <Input onChangeText={(value) => formik.setFieldValue("title", value)} placeholder="Input task title..." />
              <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.description}>
              <FormControl.Label>Description</FormControl.Label>
              <Input
                multiline
                h={100}
                onChangeText={(value) => formik.setFieldValue("description", value)}
                placeholder="Create a mobile application on iOS and Android devices."
              />
              <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.deadline}>
              <FormControl.Label>End Date</FormControl.Label>
              <CustomDateTimePicker formik={formik} fieldName="deadline" />
              <FormControl.ErrorMessage>{formik.errors.deadline}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.priority}>
              <FormControl.Label>Priority</FormControl.Label>
              <CustomSelect value={formik.values?.priority} open={openSelect} setOpen={setOpenSelect} bgColor={"white"}>
                {statuses.map((status) => {
                  return (
                    <Menu.Item
                      key={status}
                      onPress={() => {
                        setOpenSelect(!openSelect);
                        formik.setFieldValue("priority", status);
                      }}
                    >
                      <Text>{status}</Text>
                    </Menu.Item>
                  );
                })}
              </CustomSelect>
              <FormControl.ErrorMessage>{formik.errors.priority}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.score}>
              <FormControl.Label>Score</FormControl.Label>
              <CustomSelect value={formik.values?.score} open={openScore} setOpen={setOpenScore} bgColor={"white"}>
                {scores.map((score) => {
                  return (
                    <Menu.Item
                      key={score}
                      onPress={() => {
                        setOpenScore(!openScore);
                        formik.setFieldValue("priority", score);
                      }}
                    >
                      <Text>{score}</Text>
                    </Menu.Item>
                  );
                })}
              </CustomSelect>
              <FormControl.ErrorMessage>{formik.errors.score}</FormControl.ErrorMessage>
            </FormControl>

            <Button bgColor="primary.600" borderRadius={15} onPress={formik.handleSubmit}>
              Create
            </Button>
          </Flex>
        </ScrollView>
      </Box>
    </Slide>
  );
};

export default NewTaskSlider;
