import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions, View, Text } from "react-native";
import Toast from "react-native-toast-message";

import CustomDateTimePicker from "../../components/shared/CustomDateTimePicker";
import axiosInstance from "../../config/api";
import FormButton from "../../components/shared/FormButton";
import PageHeader from "../../components/shared/PageHeader";
import Input from "../../components/shared/Forms/Input";
import Select from "../../components/shared/Forms/Select";

const TaskForm = ({ route }) => {
  const { taskData, projectId, selectedStatus, refetch } = route.params;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [taskId, setTaskId] = useState(null);

  /**
   * Handles submission of task
   * @param {*} form - form to submit
   * @param {*} status - task status
   * @param {*} setSubmitting - formik setSubmitting
   * @param {*} setStatus - formik setStatus
   */
  const submitHandler = async (form, status, setSubmitting, setStatus) => {
    try {
      if (!taskData) {
        const res = await axiosInstance.post("/pm/tasks", {
          project_id: projectId,
          status: status,
          ...form,
        });
        // Set the task id so navigation can redirect to the task detail screen
        setTaskId(res.data.data.id);
      } else {
        await axiosInstance.patch(`/pm/tasks/${taskData.id}`, form);
      }
      if (refetch) {
        refetch();
      }
      setSubmitting(false);
      setStatus("success");

      Toast.show({
        type: "success",
        text1: "Task saved!",
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      Toast.show({
        type: "error",
        text1: error.response.data.message,
        position: "bottom",
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: taskData ? true : false,
    initialValues: {
      title: taskData?.title || "",
      description: taskData?.description.toString() || "",
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
      submitHandler(values, selectedStatus || "Open", setSubmitting, setStatus);
    },
  });

  const onChangeDeadline = (value) => {
    formik.setFieldValue("deadline", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      if (taskData) {
        navigation.goBack();
      } else {
        navigation.navigate("Task Detail", { taskId: taskId });
      }
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <View style={{ backgroundColor: "white" }}>
      <View w={width} height={height} style={{ marginTop: 13, paddingHorizontal: 16 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <PageHeader
            title="New Task"
            onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack()}
          />

          <View style={{ display: "flex", gap: 17, marginTop: 22 }}>
            <Input
              formik={formik}
              title="Task Title"
              fieldName="title"
              value={formik.values.title}
              placeHolder="Input task title..."
            />

            <Input
              formik={formik}
              title="Description"
              fieldName="description"
              value={formik.values.description}
              placeHolder="Input task description..."
              multiline
            />

            <View>
              <Text style={{ marginBottom: 9 }}>End Date</Text>
              <CustomDateTimePicker defaultValue={formik.values.deadline} onChange={onChangeDeadline} />
              {formik.errors.deadline && <Text style={{ marginTop: 9, color: "red" }}>{formik.errors.deadline}</Text>}
            </View>

            <Select
              value={formik.values.priority}
              placeHolder="Select Priority"
              formik={formik}
              title="Priority"
              fieldName="priority"
              onChange={(value) => formik.setFieldValue("priority", value)}
              items={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
            />

            <Select
              value={formik.values.score}
              placeHolder="Select Score"
              formik={formik}
              title="Score"
              fieldName="score"
              onChange={(value) => formik.setFieldValue("score", value)}
              items={[
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5", value: 5 },
              ]}
            />

            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text style={{ color: "white" }}>{taskData ? "Save" : "Create"}</Text>
            </FormButton>
          </View>
        </ScrollView>

        <Toast />
      </View>
    </View>
  );
};

export default TaskForm;
