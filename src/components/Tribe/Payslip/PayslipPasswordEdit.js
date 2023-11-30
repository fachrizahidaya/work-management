import { useState, useEffect } from "react";

import { Platform, Pressable } from "react-native";
import { Actionsheet, FormControl, Icon, Input, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";

const PayslipPasswordEdit = ({
  formIsOpen,
  toggleForm,
  passwordError,
  setPasswordError,
  formik,
  hideNewPassword,
  setHideNewPassword,
  hideOldPassword,
  setHideOldPassword,
  hideConfirmPassword,
  setHideConfirmPassword,
}) => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      toggleForm(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Actionsheet
      isOpen={formIsOpen}
      onClose={() => {
        toggleForm();
        formik.resetForm();
        setPasswordError("");
      }}
    >
      <Actionsheet.Content>
        <VStack w="95%" space={3} pb={Platform.OS === "ios" && keyboardHeight}>
          <VStack w="100%" space={3}>
            <FormControl.Label>Old Password</FormControl.Label>

            <FormControl isInvalid={formik.errors.old_password || !!passwordError}>
              <Input
                variant="outline"
                type={!hideOldPassword ? "text" : "password"}
                placeholder="Enter Old password"
                value={formik.values.old_password}
                onChangeText={(value) => formik.setFieldValue("old_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setHideOldPassword(!hideOldPassword)}>
                    <Icon
                      as={<MaterialCommunityIcons name={hideOldPassword ? "eye" : "eye-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.old_password || passwordError}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl.Label>New Password</FormControl.Label>

            <FormControl isInvalid={formik.errors.new_password}>
              <Input
                variant="outline"
                type={!hideNewPassword ? "text" : "password"}
                placeholder="Enter New password"
                value={formik.values.new_password}
                onChangeText={(value) => formik.setFieldValue("new_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setHideNewPassword(!hideNewPassword)}>
                    <Icon
                      as={<MaterialCommunityIcons name={hideNewPassword ? "eye" : "eye-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.new_password}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl.Label>Confirm New Password</FormControl.Label>

            <FormControl isInvalid={formik.errors.confirm_password}>
              <Input
                variant="outline"
                type={!hideConfirmPassword ? "text" : "password"}
                placeholder="Enter Confirm password"
                value={formik.values.confirm_password}
                onChangeText={(value) => formik.setFieldValue("confirm_password", value)}
                InputRightElement={
                  <Pressable onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                    <Icon
                      as={<MaterialCommunityIcons name={hideConfirmPassword ? "eye" : "eye-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.confirm_password}</FormControl.ErrorMessage>
            </FormControl>
            {formik.values.old_password && formik.values.new_password && formik.valuesconfirm_password ? (
              <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                <Text color="#FFFFFF">Submit</Text>
              </FormButton>
            ) : (
              <FormButton opacity={0.5}>
                <Text color="#FFFFFF">Submit</Text>
              </FormButton>
            )}
          </VStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PayslipPasswordEdit;
