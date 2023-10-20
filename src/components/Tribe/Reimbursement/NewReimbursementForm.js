import { Flex, FormControl, Icon, Input, Select, Text, TextArea } from "native-base";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";

const NewReimbursementForm = ({ formik }) => {
  return (
    <Flex my={3} gap={11} px={1}>
      <FormControl
      // isInvalid={formik.errors.title}
      >
        <FormControl.Label>Reimbursement Title</FormControl.Label>
        <Input
          value={formik.values.title}
          onChangeText={(value) => formik.setFieldValue("title", value)}
          placeholder="Input Title"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage> */}
      </FormControl>
      <FormControl
      // isInvalid={formik.errors.description}
      >
        <FormControl.Label>Description</FormControl.Label>
        <TextArea
          value={formik.values.description}
          h={100}
          onChangeText={(value) => formik.setFieldValue("description", value)}
          placeholder="Input Description"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.description}</FormControl.ErrorMessage> */}
      </FormControl>
      <FormControl
      // isInvalid={formik.errors.total}
      >
        <FormControl.Label>Total</FormControl.Label>
        <Input
          type="text"
          value={formik.values.total}
          onChangeText={(value) => formik.setFieldValue("total", value)}
          placeholder="Input Total"
        />
        {/* <FormControl.ErrorMessage>{formik.errors.total}</FormControl.ErrorMessage> */}
      </FormControl>

      <FormControl isInvalid={formik.errors.date}>
        <FormControl.Label>Date</FormControl.Label>
        <CustomDateTimePicker
          defaultValue={formik.values.date}
          // onChange={onChangeEndDate}
          // disabled={!formik.values.leave_id || !selectedGenerateType}
        />
        {/* <FormControl.ErrorMessage>{formik.errors.date}</FormControl.ErrorMessage> */}
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
