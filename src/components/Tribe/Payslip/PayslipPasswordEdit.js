import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { View, Text } from "react-native";

import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";
import ActionSheet from "react-native-actions-sheet";

const PayslipPasswordEdit = ({
  hideNewPassword,
  setHideNewPassword,
  hideOldPassword,
  setHideOldPassword,
  hideConfirmPassword,
  setHideConfirmPassword,
  onUpdatePassword,
  reference,
  setPasswordError,
}) => {
  /**
   * Change password handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: yup.object().shape({
      old_password: yup.string().required("Old Password is required"),
      new_password: yup.string().required("New Password is required"),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Password doesn't match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      onUpdatePassword(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
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
      <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, marginBottom: 40 }}>
        <View style={{ gap: 5 }}>
          <Input
            formik={formik}
            title="Old Password"
            fieldName="old_password"
            value={formik.values.old_password}
            placeholder="Enter Old password"
            secureTextEntry={hideOldPassword}
            endIcon={hideOldPassword ? "eye-outline" : "eye-off-outline"}
            onPressEndIcon={() => setHideOldPassword(!hideOldPassword)}
          />
        </View>

        <View style={{ gap: 5 }}>
          <Input
            formik={formik}
            title="New Password"
            fieldName="new_password"
            value={formik.values.new_password}
            placeholder="Enter New password"
            secureTextEntry={hideNewPassword}
            endIcon={hideNewPassword ? "eye-outline" : "eye-off-outline"}
            onPressEndIcon={() => setHideNewPassword(!hideNewPassword)}
          />
        </View>

        <View style={{ gap: 5 }}>
          <Input
            formik={formik}
            title="Confirm New Password"
            fieldName="confirm_password"
            value={formik.values.confirm_password}
            placeholder="Enter Confirm password"
            secureTextEntry={hideConfirmPassword}
            endIcon={hideConfirmPassword ? "eye-outline" : "eye-off-outline"}
            onPressEndIcon={() => setHideConfirmPassword(!hideConfirmPassword)}
          />
        </View>
        {formik.values.old_password && formik.values.new_password && formik.values.confirm_password ? (
          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "#FFFFFF" }}>Submit</Text>
          </FormButton>
        ) : (
          <FormButton opacity={0.5}>
            <Text style={{ color: "#FFFFFF" }}>Submit</Text>
          </FormButton>
        )}
      </View>
    </ActionSheet>
  );
};

export default PayslipPasswordEdit;
