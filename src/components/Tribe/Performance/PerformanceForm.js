import React from "react";
import { useFormik } from "formik";

import { Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import Input from "../../shared/Forms/Input";
import FormButton from "../../shared/FormButton";
import { SheetManager } from "react-native-actions-sheet";

const PerformanceForm = ({ reference, data, threshold, weight, measurement, description }) => {
  const formik = useFormik({});

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: -20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            <TouchableOpacity
              onPress={async () => {
                await SheetManager.hide("form-sheet");
              }}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
          <Text>{description}</Text>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Threshold</Text>
            <Text>{threshold}</Text>
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Measurement</Text>
            <Text>{measurement}</Text>
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Weight</Text>
            <Text>{weight}</Text>
          </View>
          <Input
            formik={formik}
            title="Actual Achievement"
            fieldName="password"
            // value={formik.values.password}
            placeHolder="Input Number Only"
            // secureTextEntry={hidePassword}
            // endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
            // onPressEndIcon={() => setHidePassword(!hidePassword)}
          />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "#FFFFFF" }}>Download</Text>
          </FormButton>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default PerformanceForm;
