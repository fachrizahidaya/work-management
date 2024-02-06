import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";
import Input from "../../../shared/Forms/Input";

const KPIDetailItem = ({ id, target, actual, description, type, weight, threshold, measurement, onChange }) => {
  const [formValue, setFormValue] = useState(null);

  const inputRef = useRef(null);

  if (!actual) {
    var actualString = null;
  } else {
    var actualString = actual.toString();
  }

  const formik = useFormik({
    initialValues: {
      performance_kpi_value_id: id,
      actual_achievement: actual || 0,
      // actualString,
    },

    onSubmit: (values) => {
      if (formik.isValid) {
        // if (values.actual_achievement) {
        //   values.actual_achievement = Number(values.actual_achievement);
        // } else {
        //   values.actual_achievement = null;
        // }
        onChange(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange("actual_achievement", e);
    }
    setFormValue(formik.values);
  };

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue]);

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
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Actual Achievement</Text>
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
                    <Text>{weight}%</Text>
                  </View>
                  <Input
                    // innerRef={inputRef}
                    formik={formik}
                    title="Actual Achievement"
                    fieldName="actual_achievement"
                    value={formik.values.actual_achievement}
                    placeHolder="Input Number Only"
                    // keyboardType="numeric"
                    onChangeText={(value) => formik.setFieldValue("actual_achievement", value)}
                    // onChange={formikChangeHandler}
                  />
                </View>
              </TouchableWithoutFeedback>
            ),
          },
        });
      }}
    >
      <Text style={[TextProps]}>{description}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name={"chart-bar"} size={15} style={{ opacity: 0.5 }} />

        <Text style={[TextProps]}>{actual || 0} of</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
    </Pressable>
  );
};

export default KPIDetailItem;
