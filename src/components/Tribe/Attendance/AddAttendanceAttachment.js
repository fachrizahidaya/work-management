import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import SuccessModal from "../../shared/Modal/SuccessModal";
import AddAttendanceAttachmentForm from "./AddAttendanceAttachmentForm";

const AddAttendanceAttachment = ({
  onSelectFile,
  fileAttachment,
  setFileAttachment,
  onSubmit,
  reference,
  month,
  attendanceAttachmentModalIsOpen,
  toggleAttendanceAttachmentModal,
  requestType,
}) => {
  /**
   * Handle create attendance attachment
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      begin_date: dayjs().format("YYYY-MM-DD") || "",
      end_date: dayjs().format("YYYY-MM-DD") || "",
      attachment: fileAttachment?.name || "",
    },
    validationSchema: yup.object().shape({
      begin_date: yup.date().required("Start date is required"),
      end_date: yup
        .date()
        .required("End date is required")
        .min(yup.ref("begin_date"), "End date can't be less than start date"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      onSubmit(formData, setSubmitting, setStatus);
    },
  });

  /**
   * Handle begin date for attachment
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  /**
   * Handle end date for attachment
   * @param {*} value
   */
  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
      setFileAttachment(null);
    }
  }, [formik.isSubmitting, formik.status]);

  useEffect(() => {
    formik.setFieldValue("attachment", fileAttachment ? fileAttachment : "");
  }, [fileAttachment]);

  return (
    <ActionSheet
      ref={reference}
      onClose={() => {
        formik.resetForm();
        setFileAttachment(null);
        reference.current?.hide();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          <AddAttendanceAttachmentForm
            formik={formik}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            month={month}
            onSelectFile={onSelectFile}
            fileAttachment={fileAttachment}
          />
        </View>
      </TouchableWithoutFeedback>
      <SuccessModal
        isOpen={attendanceAttachmentModalIsOpen}
        toggle={toggleAttendanceAttachmentModal}
        type={requestType}
        title="Report submitted"
        description="Your report is logged"
      />
    </ActionSheet>
  );
};

export default AddAttendanceAttachment;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
