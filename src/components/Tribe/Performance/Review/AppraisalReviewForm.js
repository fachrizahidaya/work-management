import { memo } from "react";

import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import ActionSheet from "react-native-actions-sheet";
import Select from "../../../shared/Forms/Select";
import Input from "../../../shared/Forms/Input";

const AppraisalReviewForm = ({
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
  employee_choice,
  notes,
  noteValue,
  employee_notes,
}) => {
  return (
    <ActionSheet
      ref={reference}
      closeOnPressBack={false}
      closeOnTouchBackdrop={
        choiceValue == formik.values.supervisor_choice && noteValue == formik.values.notes ? true : false
      }
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
                if (choice === formik.values.supervisor_choice && notes === formik.values.supervisor_notes) {
                  null;
                } else {
                  formik.handleSubmit();
                  handleClose();
                }
              }}
            >
              <Text
                style={{
                  opacity:
                    choice == formik.values.supervisor_choice && notes === formik.values.supervisor_notes ? 0.5 : 1,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <Text>{description}</Text>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Employee Choice</Text>
            <Text>
              {employee_choice == "a"
                ? choice_a
                : employee_choice == "b"
                ? choice_b
                : employee_choice == "c"
                ? choice_c
                : employee_choice == "d"
                ? choice_d
                : choice_e}
            </Text>
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Employee Choice</Text>
            <Text>{employee_notes}</Text>
          </View>
          <Select
            title="Select your choice"
            value={formik.values.supervisor_choice}
            placeHolder="Select your answer"
            items={[
              { value: "a", label: choice_a },
              { value: "b", label: choice_b },
              { value: "c", label: choice_c },
              { value: "d", label: choice_d },
              { value: "e", label: choice_e },
            ]}
            onChange={(value) => {
              formik.setFieldValue("supervisor_choice", value);
            }}
          />

          <Input
            formik={formik}
            title="Notes"
            multiline={true}
            fieldName="notes"
            value={formik.values.supervisor_notes}
            placeHolder="Input Notes"
            onChangeText={(value) => {
              formik.setFieldValue("supervisor_notes", value);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default memo(AppraisalReviewForm);
