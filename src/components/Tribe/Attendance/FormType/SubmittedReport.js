import React from "react";
import { Text, View } from "react-native";
import Clock from "./shared/Clock";
import Options from "./shared/Options";
import Reason from "./shared/Reason";
import FormButton from "../../../shared/FormButton";

const SubmittedReport = ({
  date,
  formik,
  titleDuty,
  titleClock,
  title,
  field,
  types,
  fieldName,
  placeholder,
  alpa,
  reasonValue,
  typeValue,
}) => {
  return (
    <View style={{ gap: 10 }}>
      {!alpa ? (
        <Clock
          titleDuty={titleDuty}
          timeDuty={date?.onDuty}
          titleClock={titleClock}
          timeInOrTimeOut={date?.timeIn}
          lateOrEarly={date?.late}
        />
      ) : null}
      <Options
        formik={formik}
        value={typeValue}
        title={title}
        field={field}
        types={types}
        valueChange={(value) => formik.setFieldValue(field, value)}
        placeholder={placeholder}
      />
      <Reason formik={formik} value={reasonValue} fieldName={fieldName} />
      <FormButton
        width="full"
        size="sm"
        variant="solid"
        fontSize={12}
        isSubmitting={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        <Text style={{ color: "#FFFFFF" }}>Save</Text>
      </FormButton>
    </View>
  );
};

export default SubmittedReport;
