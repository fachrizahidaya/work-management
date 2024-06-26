import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import Select from "../../../shared/Forms/Select";
import Input from "../../../shared/Forms/Input";
import { TextProps } from "../../../shared/CustomStylings";
import { memo } from "react";

const AppraisalForm = ({
  reference,
  handleClose,
  description,
  choice_a,
  choice_b,
  choice_c,
  choice_d,
  choice_e,
  formik,
  choice,
  choiceValue,
  notes,
  noteValue,
  confirmed,
}) => {
  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      closeOnTouchBackdrop={
        confirmed || choiceValue || (null == formik.values.choice && noteValue == formik.values.notes) ? true : false
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            {!confirmed && (
              <TouchableOpacity
                onPress={() => {
                  if (choice === formik.values.choice && notes === formik.values.notes) {
                    null;
                  } else {
                    formik.handleSubmit();
                    handleClose();
                  }
                }}
              >
                <Text style={{ opacity: choice == formik.values.choice && notes === formik.values.notes ? 0.5 : 1 }}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text>{description}</Text>
          {confirmed ? (
            <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "#E2E2E2", padding: 10, opacity: 0.5 }}>
              <Text style={[TextProps]}>
                {choice == "a"
                  ? choice_a
                  : choice == "b"
                  ? choice_b
                  : choice == "c"
                  ? choice_c
                  : choice == "d"
                  ? choice_d
                  : choice_e}
              </Text>
            </View>
          ) : (
            <Select
              value={formik.values.choice}
              placeHolder="Select your answer"
              items={[
                { value: "a", label: choice_a },
                { value: "b", label: choice_b },
                { value: "c", label: choice_c },
                { value: "d", label: choice_d },
                { value: "e", label: choice_e },
              ]}
              onChange={(value) => {
                formik.setFieldValue("choice", value);
              }}
            />
          )}
          {confirmed ? (
            <>
              <Text>Notes</Text>

              <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "#E2E2E2", padding: 10, opacity: 0.5 }}>
                <Text style={[TextProps]}>{notes}</Text>
              </View>
            </>
          ) : (
            <Input
              formik={formik}
              title="Notes"
              multiline={true}
              fieldName="notes"
              value={formik.values.notes}
              placeHolder="Input Notes"
              onChangeText={(value) => {
                formik.setFieldValue("notes", value);
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default memo(AppraisalForm);

const styles = StyleSheet.create({
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
