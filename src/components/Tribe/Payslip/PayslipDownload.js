import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Actionsheet, Icon } from "native-base";
import { Platform, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";

const PayslipDownload = ({
  downloadDialogIsOpen,
  toggleDownloadDialog,
  passwordError,
  setPasswordError,
  downloadPayslipCheckAccess,
  onDownloadPayslip,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

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
    <Actionsheet
      isOpen={downloadPayslipCheckAccess && downloadDialogIsOpen}
      onClose={() => {
        toggleDownloadDialog();
        formik.resetForm();
        setPasswordError("");
      }}
    >
      <Actionsheet.Content>
        <View style={{ width: "95%", gap: 5, paddingBottom: Platform.OS === "ios" && keyboardHeight }}>
          <View style={{ width: "100%", gap: 10 }}>
            <View>
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
            </View>
            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text style={{ color: "#FFFFFF" }}>Download</Text>
            </FormButton>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PayslipDownload;
