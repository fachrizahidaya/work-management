import React, { memo } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

import CustomDateTimePicker from "../../../../shared/CustomDateTimePicker";
import axiosInstance from "../../../../../config/api";
import { useLoading } from "../../../../../hooks/useLoading";

const DeadlineSection = ({ deadline, projectDeadline, disabled, taskId }) => {
  const { isLoading, start, stop } = useLoading(false);

  /**
   * Handles change of task deadline
   * @param {Date} newDeadline - New task deadline to be submitted
   */
  const changeTaskDeadline = async (newDeadline) => {
    try {
      start();
      await axiosInstance.patch(`/pm/tasks/${taskId}`, newDeadline);
      stop();
      Toast.show({
        type: "success",
        text1: "New deadline saved",
      });
    } catch (error) {
      console.log(error);
      stop();
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      deadline: deadline,
    },
    validationSchema: yup.object().shape({
      deadline: yup.date().required("Task deadline is required"),
    }),
    onSubmit: (values) => {
      changeTaskDeadline(values);
    },
  });

  const onChangeDeadline = (value) => {
    formik.setFieldValue("deadline", value);
    formik.handleSubmit();
  };

  const maxDate = projectDeadline?.split(" ")[0];

  return (
    <View style={{ display: "flex", gap: 10 }}>
      <Text style={{ fontWeight: 500 }}>DUE DATE</Text>
      <CustomDateTimePicker
        defaultValue={deadline}
        disabled={disabled || isLoading}
        onChange={onChangeDeadline}
        maximumDate={maxDate}
      />

      <Toast position="bottom" />
    </View>
  );
};

export default memo(DeadlineSection);
