import { useState } from "react";
import { FormControl, Spinner } from "native-base";
import { TouchableWithoutFeedback, Keyboard, View, Text } from "react-native";

import Select from "../../shared/Forms/Select";
import Input from "../../shared/Forms/Input";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";

const NewLeaveRequestForm = ({ leaveType, formik, onChangeStartDate, onChangeEndDate, isLoading, isError }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Select
          formik={formik}
          value={formik.values.leave_id}
          value1={selectedValue}
          title="Leave Type"
          placeHolder="Select Leave Type"
          fieldName="leave_id"
          items={leaveType}
          onChange={(value) => {
            formik.setFieldValue("leave_id", value);
            const selectedLeave = leaveType.find((item) => item.value === value);
            setSelectedValue(selectedLeave ? selectedLeave.value1 : null);
          }}
          key="leave_id"
        />

        <FormControl.Label>Purpose of Leaving</FormControl.Label>
        <Input multiline formik={formik} fieldName="reason" placeHolder="Input Reason" value={formik.values.reason} />

        <FormControl isInvalid={formik.errors.begin_date}>
          <FormControl.Label>Start Date</FormControl.Label>
          <CustomDateTimePicker
            defaultValue={formik.values.begin_date}
            onChange={onChangeStartDate}
            disabled={!formik.values.leave_id}
          />
          <FormControl.ErrorMessage>{formik.errors.begin_date}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.end_date}>
          <FormControl.Label>End Date</FormControl.Label>
          <CustomDateTimePicker
            defaultValue={formik.values.end_date}
            onChange={onChangeEndDate}
            disabled={!formik.values.leave_id}
          />
          <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage>
        </FormControl>

        {isLoading && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Spinner />
            <Text style={{ fontSize: 10, fontWeight: "400" }}>Checking availability...</Text>
          </View>
        )}

        {formik.values.leave_id &&
        formik.values.reason &&
        formik.values.begin_date &&
        formik.values.end_date &&
        !isLoading &&
        !isError ? (
          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "#FFFFFF" }}>Submit</Text>
          </FormButton>
        ) : (
          <FormButton opacity={0.5}>
            <Text style={{ color: "#FFFFFF" }}>Submit</Text>
          </FormButton>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewLeaveRequestForm;
