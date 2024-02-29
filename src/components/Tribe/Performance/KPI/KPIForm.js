import React from "react";

import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import Input from "../../../shared/Forms/Input";
import ActionSheet from "react-native-actions-sheet";

const KPIForm = ({
  reference,
  threshold,
  weight,
  measurement,
  description,
  formik,
  handleClose,
  achievement,
  target,
  achievementValue,
}) => {
  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      closeOnTouchBackdrop={achievementValue == formik.values.actual_achievement ? true : false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            display: "flex",
            gap: 21,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            <TouchableOpacity
              onPress={() => {
                if (achievement == formik.values.actual_achievement) {
                  null;
                } else {
                  formik.handleSubmit();
                  handleClose();
                }
              }}
            >
              <Text
                style={{
                  opacity: achievement == formik.values.actual_achievement ? 0.5 : 1,
                }}
              >
                Save
              </Text>
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
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Goals / Target</Text>
            <Text>{target}</Text>
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Weight</Text>
            <Text>{weight}%</Text>
          </View>
          <Input
            formik={formik}
            title="Actual Achievement"
            fieldName="actual_achievement"
            value={achievementValue === achievement ? formik.values.actual_achievement : achievementValue}
            placeHolder="Input Number Only"
            keyboardType="numeric"
            onChangeText={(value) => {
              formik.setFieldValue("actual_achievement", value);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default KPIForm;
