import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";
import ActionSheet from "react-native-actions-sheet";

const PayslipDownload = ({ reference, toggleDownloadDialog, setPasswordError, onDownloadPayslip }) => {
  const [hidePassword, setHidePassword] = useState(true);

  /**
   * Handle input password payslip
   */
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: yup.object().shape({
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      onDownloadPayslip(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      toggleDownloadDialog();
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <ActionSheet
      ref={reference}
      onClose={() => {
        formik.resetForm();
        setPasswordError("");
        reference.current?.hide();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            display: "flex",
            gap: 21,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 40,
          }}
        >
          <Input
            formik={formik}
            title="Password"
            fieldName="password"
            value={formik.values.password}
            placeHolder="Enter your KSS password"
            secureTextEntry={hidePassword}
            endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
            onPressEndIcon={() => setHidePassword(!hidePassword)}
          />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "#FFFFFF" }}>Download</Text>
          </FormButton>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default PayslipDownload;
