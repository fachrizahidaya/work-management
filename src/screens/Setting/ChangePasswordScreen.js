import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Button, Flex, FormControl, Icon, Input, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";

const ChangePasswordScreen = () => {
  const toast = useToast();
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
      setSubmitting(false);
      resetForm();
      navigation.navigate("Log Out");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Password saved, redirecting to login screen"} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
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
        <Flex marginHorizontal={16} marginVertical={13} flex={1} style={{ gap: 24 }}>
          <PageHeader title="Password" onPress={() => !formik.isSubmitting && navigation.goBack()} />

          <VStack space={17}>
            <FormControl isInvalid={formik.errors.old_password}>
              <FormControl.Label>Old Password</FormControl.Label>
              <Input
                size="md"
                type={!showPassword ? "text" : "password"}
                value={formik.values.old_password}
                onChangeText={(value) => formik.setFieldValue("old_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.old_password}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.new_password}>
              <FormControl.Label>New Password</FormControl.Label>
              <Input
                size="md"
                type={!showNewPassword ? "text" : "password"}
                value={formik.values.new_password}
                onChangeText={(value) => formik.setFieldValue("new_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon
                      as={<MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.new_password}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl mb={8} isInvalid={formik.errors.confirm_password}>
              <FormControl.Label>Confirm New Password</FormControl.Label>
              <Input
                size="md"
                type={!showRepeatPassword ? "text" : "password"}
                value={formik.values.confirm_password}
                onChangeText={(value) => formik.setFieldValue("confirm_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                    <Icon
                      as={<MaterialIcons name={showRepeatPassword ? "visibility" : "visibility-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.confirm_password}</FormControl.ErrorMessage>
            </FormControl>

            <Button
              onPress={formik.handleSubmit}
              disabled={formik.isSubmitting}
              bgColor={formik.isSubmitting ? "coolGray.500" : "primary.600"}
            >
              {!formik.isSubmitting ? <Text color="white">Save</Text> : <Spinner color="white" size="sm" />}
            </Button>
          </VStack>
        </Flex>
      </TouchableWithoutFeedback>
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
