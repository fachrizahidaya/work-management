import React from "react";
import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Select from "../../../shared/Forms/Select";
import { TextProps } from "../../../shared/CustomStylings";

const AttachmentForm = ({ reference, onSelectFile, kpiValues, formik, onChange, handleClose }) => {
  const kpi = kpiValues.map((item, index) => {
    return {
      value: item.id,
      label: item.description,
    };
  });

  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      //   closeOnTouchBackdrop={choiceValue == formik.values.choice && noteValue == formik.values.notes ? true : false}
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
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Attachment</Text>
            <TouchableOpacity
              onPress={() => {
                // if (choice === formik.values.choice && notes === formik.values.notes) {
                null;
                // } else {
                formik.handleSubmit();
                handleClose();
                // }
              }}
            >
              <Text
                style={
                  {
                    // opacity: choice == formik.values.choice && notes === formik.values.notes ? 0.5 : 1
                  }
                }
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <Select
            title="KPI"
            // value={formik.values.choice}
            placeHolder="Select your KPI"
            items={kpi}
            // onChange={(value) => {
            //   formik.setFieldValue("choice", value);
            // }}
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
                {/* {!fileAttachment ? "Upload image or .pdf" : fileAttachment?.name} */}
              </Text>
              <MaterialCommunityIcons
                name="attachment"
                size={20}
                style={{ transform: [{ rotate: "-35deg" }] }}
                color="#3F434A"
              />
            </Pressable>
            {/* {!formik.errors.attachment ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.attachment}</Text>
            )} */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default AttachmentForm;

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
