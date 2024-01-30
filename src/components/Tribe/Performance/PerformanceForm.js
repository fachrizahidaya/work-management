import React from "react";
import { useFormik } from "formik";

import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import Input from "../../shared/Forms/Input";
import ActionSheet from "react-native-actions-sheet";

const PerformanceForm = ({ reference, threshold, weight, measurement, description, actual, onClose }) => {
  const formik = useFormik({});

  return (
    <ActionSheet ref={reference}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            <TouchableOpacity
              onPress={async () => {
                reference.current?.hide();
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
            <Text>{weight} %</Text>
          </View>
          <Input
            // formik={formik}
            title="Actual Achievement"
            // fieldName="actual_achievement"
            defaultValue={actual}
            // value={formik.values.password}
            placeHolder="Input Number Only"
            // secureTextEntry={hidePassword}
            // endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
            // onPressEndIcon={() => setHidePassword(!hidePassword)}
            keyboardType="numeric"
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default PerformanceForm;
