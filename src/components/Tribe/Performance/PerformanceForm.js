import React, { useState } from "react";

import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import Input from "../../shared/Forms/Input";
import ActionSheet from "react-native-actions-sheet";

const PerformanceForm = ({
  reference,
  threshold,
  weight,
  measurement,
  description,
  formik,
  onChange,
  kpiValues,
  formikChangeHandler,
}) => {
  return (
    <ActionSheet ref={reference}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            <TouchableOpacity
              onPress={() => {
                formik.handleSubmit();
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
            formik={formik}
            title="Actual Achievement"
            fieldName="actual_achievement"
            value={formik.values.actual_achievement}
            placeHolder="Input Number Only"
            keyboardType="numeric"
            onChangeText={(value) => formik.setFieldValue("actual_achievement", value)}

            // onChange={(value) => formik.setFieldValue("actual_achievement", value ? value : 0)}
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default PerformanceForm;
