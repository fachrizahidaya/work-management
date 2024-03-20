import React from "react";
import { Text, View } from "react-native";
import { Clock, Options, Reason } from "../AttendanceForm";
import FormButton from "../../../shared/FormButton";

const LateOrEarly = ({
  formik,
  arrayList,
  titleTime,
  time,
  title,
  inputValue,
  inputOnChangeText,
  selectOnValueChange,
  titleDuty,
  timeDuty,
  timeLateOrEarly,
  placeholder,
  fieldOption,
  inputType,
}) => {
  return (
    <View style={{ gap: 10 }}>
      <Clock
        titleDuty={titleDuty}
        timeDuty={timeDuty}
        titleClock={titleTime}
        timeInOrTimeOut={time}
        lateOrEarly={timeLateOrEarly}
      />
      <Options
        formik={formik}
        title={title}
        field={fieldOption}
        types={arrayList}
        value={inputType}
        valueChange={selectOnValueChange}
        placeholder={placeholder}
      />
      <Reason formik={formik} value={inputValue} onChangeText={inputOnChangeText} />
      <FormButton
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

export default LateOrEarly;
