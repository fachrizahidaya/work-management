import { useState } from "react";
import { TouchableWithoutFeedback, Keyboard, View, Text, ActivityIndicator } from "react-native";

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

        <Text>Purpose of Leaving</Text>
        <Input multiline formik={formik} fieldName="reason" placeHolder="Input Reason" value={formik.values.reason} />

        <View>
          <Text>Start Date</Text>
          <CustomDateTimePicker
            defaultValue={formik.values.begin_date}
            onChange={onChangeStartDate}
            disabled={!formik.values.leave_id}
          />
          <Text>{formik.errors.begin_date}</Text>
        </View>

        <View>
          <Text>End Date</Text>
          <CustomDateTimePicker
            defaultValue={formik.values.end_date}
            onChange={onChangeEndDate}
            disabled={!formik.values.leave_id}
          />
          <Text>{formik.errors.end_date}</Text>
        </View>

        {isLoading && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator />
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
