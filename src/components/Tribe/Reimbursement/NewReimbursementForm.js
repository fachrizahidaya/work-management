import { View, Text } from "react-native";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";
import { TextProps } from "../../shared/CustomStylings";

const NewReimbursementForm = ({ formik }) => {
  return (
    <View style={{ marginVertical: 5, paddingHorizontal: 5, gap: 20 }}>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          value={formik.values.title}
          onChangeText={(value) => formik.setFieldValue("title", value)}
          placeholder="Input Title"
        />
      </View>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          value={formik.values.description}
          h={100}
          onChangeText={(value) => formik.setFieldValue("description", value)}
          placeholder="Input Description"
        />
      </View>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          type="text"
          value={formik.values.total}
          onChangeText={(value) => formik.setFieldValue("total", value)}
          placeholder="Input Total"
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 14 }, TextProps]}>Start Date</Text>
        <CustomDateTimePicker
          defaultValue={formik.values.date}
          // onChange={onChangeEndDate}
          // disabled={!formik.values.leave_id || !selectedGenerateType}
        />
        {/* <Text style={{ color: "#FF6262" }}>{formik.errors.end_date}</Text> */}
      </View>

      <FormButton
      // isSubmitting={formik.isSubmitting}
      //  onPress={formik.handleSubmit}
      >
        <Text color="#FFFFFF">Submit</Text>
      </FormButton>
    </View>
  );
};

export default NewReimbursementForm;
