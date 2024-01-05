import React, { memo } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import Toast from "react-native-root-toast";

import { Text, View } from "react-native";

import CustomDateTimePicker from "../../../../shared/CustomDateTimePicker";
import axiosInstance from "../../../../../config/api";
import { useLoading } from "../../../../../hooks/useLoading";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../../../shared/CustomStylings";

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
      Toast.show("New deadline saved", SuccessToastProps);
    } catch (error) {
      console.log(error);
      stop();
      Toast.show(error.response.data.message, ErrorToastProps);
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
      <Text style={[{ fontWeight: 500 }, TextProps]}>DUE DATE</Text>
      <CustomDateTimePicker
        defaultValue={deadline}
        disabled={disabled || isLoading}
        onChange={onChangeDeadline}
        maximumDate={maxDate}
      />
    </View>
  );
};

export default memo(DeadlineSection);
