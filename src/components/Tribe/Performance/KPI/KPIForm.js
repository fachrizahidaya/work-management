import React from "react";

import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../../shared/Forms/Input";
import { TextProps } from "../../../shared/CustomStylings";

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
  onSelectFile,
  fileAttachment,
  attachment,
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
          <View style={{ gap: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[{ fontSize: 14 }, TextProps]}>Attachment</Text>
            </View>
            <Pressable onPress={onSelectFile} style={styles.attachment}>
              <Text
                style={[
                  {
                    fontSize: 12,
                    opacity: 0.5,
                    overflow: "hidden",
                    width: 300,
                  },
                  TextProps,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {!fileAttachment ? "Upload image or .pdf" : fileAttachment?.name}
              </Text>
              <MaterialCommunityIcons
                name="attachment"
                size={20}
                style={{ transform: [{ rotate: "-35deg" }] }}
                color="#3F434A"
              />
            </Pressable>
            {!formik.errors.attachment ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.attachment}</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default KPIForm;

const styles = StyleSheet.create({
  attachment: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E8E9EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
