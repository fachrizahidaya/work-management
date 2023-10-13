import { Flex, FormControl, Icon, Select, Text, TextArea } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";

const NewLeaveRequestForm = ({ formik, leaveType, onChangeEndDate, onChangeStartDate, selectedGenerateType }) => {
  return (
    <Flex gap={13}>
      <FormControl isInvalid={formik.errors.leave_id}>
        <FormControl.Label>Leave Type</FormControl.Label>
      </FormControl>
      <Select
        mt={-3}
        selectedValue={formik.values.leave_id}
        onValueChange={(value) => formik.setFieldValue("leave_id", value)}
        borderRadius={15}
        borderWidth={1}
        variant="unstyled"
        key="leave_id"
        accessibilityLabel="Select Leave type"
        placeholder="Select Leave type"
        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
      >
        {leaveType?.data.map((item) => {
          return <Select.Item label={item?.name} value={item?.id} key={item?.id} />;
        })}
      </Select>
      <FormControl mt={-2} isInvalid={formik.errors.leave_id}>
        <FormControl.ErrorMessage>{formik.errors.leave_id}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl isInvalid={formik.errors.reason}>
        <FormControl.Label>Purpose of Leaving</FormControl.Label>
        <TextArea
          value={formik.values.reason}
          h={100}
          onChangeText={(value) => formik.setFieldValue("reason", value)}
          placeholder="Input purpose"
        />
        <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage>
      </FormControl>

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
          disabled={!formik.values.leave_id || !selectedGenerateType}
        />
        <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage>
      </FormControl>

      <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
        <Text color="white">Submit</Text>
      </FormButton>
    </Flex>
  );
};

export default NewLeaveRequestForm;
