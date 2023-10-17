import { Flex, FormControl, Icon, Input, Select, Text, TextArea } from "native-base";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";

const NewReimbursementForm = () => {
  return (
    <Flex my={3} gap={11} px={1}>
      <FormControl
      // isInvalid={formik.errors.reason}
      >
        <FormControl.Label>Reimbursement Title</FormControl.Label>
        <Input
          // value={formik.values.reason}

          // onChangeText={(value) => formik.setFieldValue("reason", value)}
          placeholder="Input Title"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage> */}
      </FormControl>
      <FormControl
      // isInvalid={formik.errors.reason}
      >
        <FormControl.Label>Description</FormControl.Label>
        <TextArea
          // value={formik.values.reason}
          h={100}
          // onChangeText={(value) => formik.setFieldValue("reason", value)}
          placeholder="Input Description"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage> */}
      </FormControl>
      <FormControl
      // isInvalid={formik.errors.reason}
      >
        <FormControl.Label>Total</FormControl.Label>
        <Input
          type="text"
          // value={formik.values.reason}

          // onChangeText={(value) => formik.setFieldValue("reason", value)}
          placeholder="Input Total"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage> */}
      </FormControl>

      <FormControl
      // isInvalid={formik.errors.end_date}
      >
        <FormControl.Label>Date</FormControl.Label>
        <CustomDateTimePicker
        // defaultValue={formik.values.end_date}
        // onChange={onChangeEndDate}
        // disabled={!formik.values.leave_id || !selectedGenerateType}
        />
        {/* <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage> */}
      </FormControl>

      <FormButton
      // isSubmitting={formik.isSubmitting}
      //  onPress={formik.handleSubmit}
      >
        <Text color="#FFFFFF">Submit</Text>
      </FormButton>
    </Flex>
  );
};

export default NewReimbursementForm;
