import React from "react";
import { useFormik } from "formik";

import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import Input from "../../shared/Forms/Input";
import FormButton from "../../shared/FormButton";

const PerformanceForm = ({ reference }) => {
  const formik = useFormik({});
  return (
    <ActionSheet ref={reference} onClose={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Actual Achievement</Text>
            <Pressable>
              <Text>Done</Text>
            </Pressable>
          </View>
          <Input
            formik={formik}
            title="Password"
            fieldName="password"
            // value={formik.values.password}
            placeHolder="Enter your KSS password"
            // secureTextEntry={hidePassword}
            // endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
            // onPressEndIcon={() => setHidePassword(!hidePassword)}
          />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "#FFFFFF" }}>Download</Text>
          </FormButton>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default PerformanceForm;
