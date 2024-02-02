import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";
import Toast from "react-native-root-toast";

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions, View, Text } from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import CustomDateTimePicker from "../../components/shared/CustomDateTimePicker";
import axiosInstance from "../../config/api";
import FormButton from "../../components/shared/FormButton";
import PageHeader from "../../components/shared/PageHeader";
import Input from "../../components/shared/Forms/Input";
import Select from "../../components/shared/Forms/Select";
import { ErrorToastProps, SuccessToastProps } from "../../components/shared/CustomStylings";

const TaskForm = ({ route }) => {
  const richText = useRef();
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

      Toast.show("Task saved", SuccessToastProps);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      Toast.show(error.response.data.message, ErrorToastProps);
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

  // To change empty p tag to br tag
  const preprocessContent = (content) => {
    return content.replace(/<p><\/p>/g, "<br/>");
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

            {/* <Input
              formik={formik}
              title="Description"
              fieldName="description"
              value={formik.values.description}
              placeHolder="Input task description..."
              multiline
            /> */}

            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              iconTint="#000"
              selectedIconTint="#176688"
            />

            <ScrollView
              style={{ height: 200, borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB", paddingBottom: 40 }}
            >
              <RichEditor
                ref={richText}
                onChange={(descriptionText) => {
                  formik.setFieldValue("description", descriptionText);
                }}
                initialContentHTML={preprocessContent(formik.values.description)}
              />
            </ScrollView>

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

            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text style={{ color: "white" }}>{taskData ? "Save" : "Create"}</Text>
            </FormButton>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TaskForm;
