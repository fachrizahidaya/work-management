import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import { Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import Input from "../../../shared/Forms/Input";
import { TextProps } from "../../../shared/CustomStylings";

const AppraisalDetailItem = ({
  id,
  target,
  choice,
  description,
  type,
  weight,
  threshold,
  measurement,
  onChange,
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
}) => {
  const [formValue, setFormValue] = useState(null);

  const formik = useFormik({
    initialValues: {
      performance_appraisal_value_id: id,
      choice: choice || "",
    },

    onSubmit: (values) => {
      if (formik.isValid) {
        onChange(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange(e);
    }
    setFormValue(formik.values);
  };

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue, formik.handleSubmit]);

  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() => {
        // onSelect(item);
        SheetManager.show("form-sheet", {
          payload: {
            children: (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                  style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: -20 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Indicator</Text>
                    <TouchableOpacity
                      onPress={async () => {
                        await SheetManager.hide("form-sheet");
                        formik.handleSubmit();
                      }}
                    >
                      <Text>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Text>{description}</Text>
                  <View style={{ gap: 10 }}>
                    <Pressable
                      style={{
                        padding: 10,
                        borderWidth: choice == "a" ? null : 1,
                        borderRadius: 10,
                        borderColor: choice == "a" ? null : "#C5C5C5",
                        backgroundColor: choice == "a" ? "#75C4E6" : null,
                      }}
                    >
                      <Text>{choice_a}</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        padding: 10,
                        borderWidth: choice == "b" ? null : 1,
                        borderRadius: 10,
                        borderColor: choice == "b" ? null : "#C5C5C5",
                        backgroundColor: choice == "b" ? "#75C4E6" : null,
                      }}
                    >
                      <Text>{choice_b}</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        padding: 10,
                        borderWidth: choice == "c" ? null : 1,
                        borderRadius: 10,
                        borderColor: choice == "c" ? null : "#C5C5C5",
                        backgroundColor: choice == "c" ? "#75C4E6" : null,
                      }}
                    >
                      <Text>{choice_c}</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        padding: 10,
                        borderWidth: choice == "d" ? null : 1,
                        borderRadius: 10,
                        borderColor: choice == "d" ? null : "#C5C5C5",
                        backgroundColor: choice == "d" ? "#75C4E6" : null,
                      }}
                    >
                      <Text>{choice_d}</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        padding: 10,
                        borderWidth: choice == "e" ? null : 1,
                        borderRadius: 10,
                        borderColor: choice == "e" ? null : "#C5C5C5",
                        backgroundColor: choice == "e" ? "#75C4E6" : null,
                      }}
                    >
                      <Text>{choice_e}</Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ),
          },
        });
      }}
    >
      <Text style={[TextProps]}>{description}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name={"widgets-outline"} size={15} style={{ opacity: 0.5 }} />

        <Text style={[TextProps]}>Press to see the answer</Text>
      </View>
    </Pressable>
  );
};

export default AppraisalDetailItem;
