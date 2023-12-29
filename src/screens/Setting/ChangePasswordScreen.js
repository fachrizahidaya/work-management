import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";

import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import Input from "../../components/shared/Forms/Input";
import Button from "../../components/shared/Forms/Button";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);

  /**
   * Handles the submission of password change.
   * @param {object} form - The form containing old and new passwords.
   * @param {function} setSubmitting - A function to control the form submitting state.
   */
  const changePasswordHandler = async (form, setSubmitting, resetForm) => {
    try {
      // Send a POST request to change the user's password
      await axiosInstance.post("/auth/change-password", form);
      resetForm();
      Toast.show({
        type: "success",
        text1: "Password saved, redirecting to login screen...",
        position: "bottom",
      });
      setTimeout(() => {
        setSubmitting(false);
        navigation.navigate("Log Out");
      }, 1500);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
        position: "bottom",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: yup.object().shape({
      old_password: yup.string().required("Old password is required"),
      new_password: yup
        .string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .required("New password is required!"),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Passwords must match")
        .required("Input your new password again"),
    }),
    validateOnChange: true,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      changePasswordHandler(values, setSubmitting, resetForm);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ gap: 24, display: "flex", marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
          <PageHeader title="Password" onPress={() => !formik.isSubmitting && navigation.goBack()} />

          <View style={{ display: "flex", gap: 17 }}>
            <Input
              formik={formik}
              value={formik.values.old_password}
              title="Old password"
              secureTextEntry={showPassword}
              placeHolder="Input your old password..."
              fieldName="old_password"
              endAdornment={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} />
                </Pressable>
              }
            />

            <Input
              formik={formik}
              value={formik.values.new_password}
              title="New password"
              secureTextEntry={showNewPassword}
              placeHolder="Input your new password..."
              fieldName="new_password"
              endAdornment={
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                  <MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} size={20} />
                </Pressable>
              }
            />

            <Input
              formik={formik}
              value={formik.values.confirm_password}
              title="Repeat new password"
              secureTextEntry={showRepeatPassword}
              placeHolder="Repeat your new password..."
              fieldName="confirm_password"
              endAdornment={
                <Pressable onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                  <MaterialIcons name={showRepeatPassword ? "visibility" : "visibility-off"} size={20} />
                </Pressable>
              }
            />

            <Button
              onPress={formik.handleSubmit}
              disabled={formik.isSubmitting}
              bgColor={formik.isSubmitting ? "gray" : "#176688"}
            >
              {!formik.isSubmitting ? <Text style={{ color: "white" }}>Save</Text> : <ActivityIndicator />}
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Toast />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
