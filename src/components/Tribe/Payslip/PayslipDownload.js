import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Text, StyleSheet } from "react-native";

import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";

const PayslipDownload = ({ reference, toggleDownloadDialog, setPasswordError, onDownloadPayslip }) => {
  const [hidePassword, setHidePassword] = useState(true);

  /**
   * Input Password Handler
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
    <>
      <Input
        formik={formik}
        title="Password"
        fieldName="password"
        value={formik.values.password}
        placeholder="Enter your KSS password"
        secureTextEntry={hidePassword}
        endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
        onPressEndIcon={() => setHidePassword(!hidePassword)}
      />

      <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
        <Text style={{ color: "#FFFFFF" }}>Download</Text>
      </FormButton>
    </>
  );
};

export default PayslipDownload;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
