import { useState } from "react";

import { Actionsheet, FormControl, Icon, Input, Pressable, Text, VStack } from "native-base";
import { Platform } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import FormButton from "../../shared/FormButton";

const PayslipDownload = ({ downloadDialogIsOpen, formik, toggleDownloadDialog, passwordError, setPasswordError }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  return (
    <Actionsheet
      isOpen={downloadDialogIsOpen}
      onClose={() => {
        toggleDownloadDialog();
        formik.resetForm();
        setPasswordError("");
      }}
    >
      <Actionsheet.Content>
        <VStack w="95%" space={3} pb={Platform.OS === "ios" && keyboardHeight}>
          <VStack w="100%" space={2}>
            <FormControl.Label justifyContent="center">Password</FormControl.Label>

            <FormControl isInvalid={formik.errors.password || !!passwordError}>
              <Input
                variant="outline"
                type={!hidePassword ? "text" : "password"}
                placeholder="Enter your KSS password"
                value={formik.values.password}
                onChangeText={(value) => formik.setFieldValue("password", value)}
                InputRightElement={
                  <Pressable onPress={() => setHidePassword(!hidePassword)}>
                    <Icon
                      as={<MaterialCommunityIcons name={hidePassword ? "eye" : "eye-off"} />}
                      size={5}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
              <FormControl.ErrorMessage>{formik.errors.password || passwordError}</FormControl.ErrorMessage>
            </FormControl>
            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text color="#FFFFFF">Download</Text>
            </FormButton>
          </VStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PayslipDownload;
