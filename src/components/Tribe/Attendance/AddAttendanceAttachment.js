import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

import { View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import Input from "../../shared/Forms/Input";
import { TextProps } from "../../shared/CustomStylings";
import SuccessModal from "../../shared/Modal/SuccessModal";

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
          <View style={{ width: "100%", gap: 10 }}>
            <Input
              formik={formik}
              title="Title"
              fieldName="title"
              placeHolder="Input title"
              value={formik.values.title}
            />

            {Platform.OS === "android" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 5, width: "45%" }}>
                  <CustomDateTimePicker
                    unlimitStartDate={true}
                    defaultValue={formik.values.begin_date}
                    onChange={onChangeStartDate}
                    month={month}
                    title="Start Date"
                  />
                  {!formik.errors.begin_date ? null : (
                    <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.begin_date}</Text>
                  )}
                </View>
                <View style={{ gap: 5, width: "45%" }}>
                  <CustomDateTimePicker
                    defaultValue={formik.values.end_date}
                    onChange={onChangeEndDate}
                    month={month}
                    title="End Date"
                  />
                  {!formik.errors.end_date ? null : (
                    <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.end_date}</Text>
                  )}
                </View>
              </View>
            ) : (
              <>
                <View style={{ gap: 5 }}>
                  <CustomDateTimePicker
                    unlimitStartDate={true}
                    width="100%"
                    defaultValue={formik.values.begin_date}
                    onChange={onChangeStartDate}
                    month={month}
                    title="Start Date"
                  />
                  {!formik.errors.begin_date ? null : (
                    <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.begin_date}</Text>
                  )}
                </View>
                <View style={{ gap: 5 }}>
                  <CustomDateTimePicker
                    width="100%"
                    defaultValue={formik.values.end_date}
                    onChange={onChangeEndDate}
                    month={month}
                    title="End Date"
                  />
                  {!formik.errors.end_date ? null : (
                    <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.end_date}</Text>
                  )}
                </View>
              </>
            )}

            <View style={{ gap: 5 }}>
              <Text style={[{ fontSize: 14 }, TextProps]}>Attachment</Text>
              <Pressable onPress={onSelectFile} style={styles.attachment}>
                <Text
                  style={[
                    {
                      fontSize: 12,
                      opacity: 0.5,
                      overflow: "hidden",
                      width: 300,
                    },
                    TextProps,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {!fileAttachment ? "Upload image or .pdf" : fileAttachment?.name}
                </Text>
                <MaterialCommunityIcons
                  name="attachment"
                  size={20}
                  style={{ transform: [{ rotate: "-35deg" }] }}
                  color="#3F434A"
                />
              </Pressable>
              {!formik.errors.attachment ? null : (
                <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.attachment}</Text>
              )}
            </View>

            {!formik.values.attachment ||
            !formik.values.title ||
            !formik.values.begin_date ||
            !formik.values.end_date ? (
              <FormButton opacity={0.5} disabled={true}>
                {
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: "#FFFFFF",
                    }}
                  >
                    Submit
                  </Text>
                }
              </FormButton>
            ) : (
              <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                {
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: "#FFFFFF",
                    }}
                  >
                    Submit
                  </Text>
                }
              </FormButton>
            )}
          </View>
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
  attachment: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E8E9EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
