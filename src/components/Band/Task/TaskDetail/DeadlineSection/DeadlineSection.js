import React, { memo } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { FormControl, useToast } from "native-base";

import CustomDateTimePicker from "../../../../shared/CustomDateTimePicker";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import { useLoading } from "../../../../../hooks/useLoading";

const DeadlineSection = ({ deadline, projectDeadline, disabled, taskId }) => {
  const toast = useToast();
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
      toast.show({
        render: () => {
          return <SuccessToast message={`New deadline saved`} />;
        },
      });
    } catch (error) {
      console.log(error);
      stop();
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
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
    <FormControl>
      <FormControl.Label>DUE DATE</FormControl.Label>
      <CustomDateTimePicker
        defaultValue={deadline}
        disabled={disabled || isLoading}
        onChange={onChangeDeadline}
        maximumDate={maxDate}
      />
    </FormControl>
  );
};

export default memo(DeadlineSection);
