import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";

import { Platform, View, Text, Pressable, StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import Input from "../../shared/Forms/Input";

const AddAttendanceAttachment = ({
  isOpen,
  toggle,
  onSelectFile,
  fileAttachment,
  setFileAttachment,
  onSubmit,
  reference,
}) => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();
  const formik = useFormik({
    initialValues: {
      title: "",
      begin_date: "",
      end_date: "",
      attachment: fileAttachment?.name || "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required"),
      begin_date: yup.date().required("Start date is required"),
      end_date: yup
        .date()
        .required("End date is required")
        .min(yup.ref("begin_date"), "End date can't be less than start date"),
      attachment: yup.mixed().required("Attachment file is required"),
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
   * Begin and End date Leave handler
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      reference.current?.hide();
      formik.resetForm();
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
      <View style={styles.wrapper}>
        <View style={{ width: "95%", gap: 3, paddingBottom: Platform.OS === "ios" && keyboardHeight }}>
          <View style={{ width: "100%", gap: 3 }}>
            <View>
              <Input
                formik={formik}
                title="Title"
                fieldName="title"
                placeHolder="Input title"
                value={formik.values.title}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ gap: 5 }}>
                <Text>Start Date</Text>
                <CustomDateTimePicker
                  width={180}
                  defaultValue={formik.values.begin_date}
                  onChange={onChangeStartDate}
                />
                <Text style={{ color: "red" }}>{formik.errors.begin_date}</Text>
              </View>
              <View style={{ gap: 5 }}>
                <Text>End Date</Text>
                <CustomDateTimePicker width={180} defaultValue={formik.values.end_date} onChange={onChangeEndDate} />
                <Text style={{ color: "red" }}>{formik.errors.end_date}</Text>
              </View>
            </View>

            <View style={{ gap: 5 }}>
              <Text>Attachment</Text>
              <Pressable onPress={onSelectFile} style={styles.attachment}>
                <Text style={{ fontSize: 12, fontWeight: "400", opacity: 0.5 }}>
                  {!fileAttachment ? "Upload file..." : fileAttachment?.name}
                </Text>
                <MaterialCommunityIcons name="attachment" style={{ transform: [{ rotate: "-35deg" }] }} />
              </Pressable>
              <Text style={{ color: "red" }}>{formik.errors.attachment}</Text>
            </View>

            {!formik.values.attachment ? (
              <FormButton opacity={0.5} disabled={true} children="Submit" fontColor="white" />
            ) : (
              <FormButton
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
                children="Submit"
                fontColor="white"
              />
            )}
          </View>
        </View>
      </View>
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
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
