import React from "react";
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Select from "../../../shared/Forms/Select";

const AppraisalForm = ({
  reference,
  handleClose,
  selected,
  setSelected,
  description,
  choice_a,
  choice_b,
  choice_c,
  choice_d,
  choice_e,
  score_a,
  score_b,
  score_c,
  score_d,
  score_e,
  formik,
}) => {
  return (
    <ActionSheet ref={reference}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
            <TouchableOpacity
              onPress={() => {
                handleClose();
              }}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
          <Text>{description}</Text>
          <Select
            value={selected}
            placeHolder="Select your answer"
            items={[
              { value: score_a, label: choice_a },
              { value: score_b, label: choice_b },
              { value: score_c, label: choice_c },
              { value: score_d, label: choice_d },
              { value: score_e, label: choice_e },
            ]}
            onChange={(value) => setSelected(value)}
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default AppraisalForm;
