import { memo } from "react";

import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
  confirmed,
  attachment,
  onDownload,
}) => {
  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      closeOnTouchBackdrop={confirmed || achievementValue == formik.values.actual_achievement ? true : false}
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
            {!confirmed && (
              <TouchableOpacity
                onPress={() => {
                  if (achievement == formik.values.actual_achievement) {
                    null;
                  } else {
                    formik.handleSubmit();
                    handleClose(reference);
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
            )}
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
          {confirmed ? (
            <View style={{ gap: 3 }}>
              <Text>Actual Achievement</Text>

              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E2E2E2",
                  padding: 10,
                  opacity: 0.5,
                }}
              >
                <Text style={[TextProps]}>{formik.values.actual_achievement}</Text>
              </View>
            </View>
          ) : (
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
          )}
          <View style={{ gap: 3 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[{ fontSize: 12, opacity: 0.5 }]}>Attachment</Text>
            </View>
            <View style={styles.attachment}>
              {attachment?.length > 0 ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                  {attachment?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => onDownload(item?.file_path)}
                        style={{
                          gap: 5,
                          backgroundColor: "#f8f8f8",
                          padding: 8,
                          borderRadius: 10,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={[TextProps, { fontSize: 10, color: "#176688" }]}>{item?.file_name}</Text>
                        <MaterialCommunityIcons name="tray-arrow-down" size={15} color="#176688" />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={[TextProps]}>No Attachment</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default memo(KPIForm);

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
