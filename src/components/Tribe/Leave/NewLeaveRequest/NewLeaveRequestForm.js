import { useState } from "react";

import { View, Text, ActivityIndicator } from "react-native";

import Input from "../../../shared/Forms/Input";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import FormButton from "../../../shared/FormButton";
import { TextProps } from "../../../shared/CustomStylings";
import SelectWithSearch from "../../../shared/Forms/SelectWithSearch";

const NewLeaveRequestForm = ({
  leaveType,
  formik,
  onChangeStartDate,
  onChangeEndDate,
  isLoading,
  isError,
  reference,
  handleSearch,
  inputToShow,
  setInputToShow,
  setSearchInput,
  startDateMore,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <View style={{ gap: 20 }}>
      <SelectWithSearch
        reference={reference}
        placeHolder="Select Leave Type"
        title="Leave Type"
        items={leaveType}
        formik={formik}
        value={formik.values.leave_id}
        fieldName="leave_id"
        onChange={(value) => {
          formik.setFieldValue("leave_id", value);
          const selectedLeave = leaveType.find((item) => item.value === value);
          setSelectedValue(selectedLeave ? selectedLeave.value : null);
        }}
        key="leave_id"
        inputToShow={inputToShow}
        setInputToShow={setInputToShow}
        setSearchInput={setSearchInput}
        fieldNameSearch="search"
        handleSearch={handleSearch}
      />

      <Input
        multiline
        formik={formik}
        title="Purpose of Leaving"
        fieldName="reason"
        placeHolder="Input Reason"
        value={formik.values.reason}
        editable={!formik.values.leave_id ? false : true}
      />

      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 14 }, TextProps]}>Start Date</Text>
        <CustomDateTimePicker
          defaultValue={formik.values.begin_date}
          onChange={onChangeStartDate}
          disabled={!formik.values.leave_id ? true : false}
          unlimitStartDate={true}
        />
        <Text style={{ color: "#FF6262" }}>{formik.errors.begin_date}</Text>
        <Text style={[{ fontSize: 14 }, TextProps]}>End Date</Text>
        <CustomDateTimePicker
          defaultValue={formik.values.end_date}
          onChange={onChangeEndDate}
          disabled={!formik.values.leave_id ? true : false}
        />
        <Text style={{ color: "#FF6262" }}>{formik.errors.end_date}</Text>
      </View>

      {isLoading && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <ActivityIndicator />
          <Text style={[{ fontSize: 10 }, TextProps]}>Checking availability...</Text>
        </View>
      )}

      {formik.values.leave_id &&
      formik.values.reason &&
      formik.values.begin_date &&
      formik.values.end_date &&
      !isLoading &&
      !isError &&
      !startDateMore ? (
        <FormButton isSubmitting={formik.isSubmitting} disabled={false} onPress={formik.handleSubmit}>
          <Text style={{ color: "#FFFFFF" }}>Submit</Text>
        </FormButton>
      ) : (
        <FormButton opacity={0.5} isSubmitting={null} disabled={true} onPress={null}>
          <Text style={{ color: "#FFFFFF" }}>Submit</Text>
        </FormButton>
      )}
    </View>
  );
};

export default NewLeaveRequestForm;
