import React from "react";
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Select from "../../../shared/Forms/Select";

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
}) => {
  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      closeOnTouchBackdrop={choiceValue == formik.values.choice ? true : false}
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
                if (choice === formik.values.choice) {
                  null;
                } else {
                  formik.handleSubmit();
                  handleClose();
                }
              }}
            >
              <Text style={{ opacity: choice == formik.values.choice ? 0.5 : 1 }}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text>{description}</Text>
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
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default AppraisalForm;
