import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";
import Toast from "react-native-root-toast";

import { Dimensions, Keyboard, TouchableWithoutFeedback, View, Text } from "react-native";

import CustomDateTimePicker from "../../components/shared/CustomDateTimePicker";
import axiosInstance from "../../config/api";
import FormButton from "../../components/shared/FormButton";
import PageHeader from "../../components/shared/PageHeader";
import Input from "../../components/shared/Forms/Input";
import Select from "../../components/shared/Forms/Select";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../components/shared/CustomStylings";

const ProjectForm = ({ route }) => {
  const { width, height } = Dimensions.get("window");
  const { projectData, refetchSelectedProject, teamMembers } = route.params;
  const navigation = useNavigation();

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
      Toast.show("Project saved", SuccessToastProps);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  const formik = useFormik({
    enableReinitialize: projectData ? true : false,
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
    validateOnChange: false,
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
      navigation.navigate("Project Detail", { projectId: projectId });
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ position: "absolute", zIndex: 3 }}>
        <View
          style={{ width: width, height: height, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: "white" }}
        >
          <PageHeader
            title="New Project"
            onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack()}
          />

          <View style={{ display: "flex", gap: 17, marginTop: 22 }}>
            <Input
              formik={formik}
              title="Project Name"
              fieldName="title"
              value={formik.values.title}
              placeHolder="Input project title..."
            />

            <Input
              formik={formik}
              title="Description"
              fieldName="description"
              value={formik.values.description}
              placeHolder="Input project description..."
              multiline
            />

            <View>
              <Text style={[{ marginBottom: 9 }, TextProps]}>End Date</Text>
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
              <Text style={{ color: "white" }}>{projectData ? "Save" : "Create"}</Text>
            </FormButton>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProjectForm;
