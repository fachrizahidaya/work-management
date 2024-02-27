import { View, Text, Pressable, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";
import { TextProps } from "../../shared/CustomStylings";

const NewReimbursementForm = ({ formik, onSelectFile, fileAttachment }) => {
  return (
    <View
      style={{
        marginTop: 20,
        marginVertical: 5,
        paddingHorizontal: 5,
        gap: 20,
      }}
    >
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          value={formik.values.title}
          onChangeText={(value) => formik.setFieldValue("title", value)}
          placeHolder="Input Title"
          title="Reimbursement Title"
        />
      </View>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          value={formik.values.description}
          h={100}
          onChangeText={(value) => formik.setFieldValue("description", value)}
          placeHolder="Input Description"
          title="Description"
        />
      </View>
      <View style={{ paddingHorizontal: 3, gap: 20 }}>
        <Input
          type="text"
          value={formik.values.total}
          onChangeText={(value) => formik.setFieldValue("total", value)}
          placeHolder="Input Total"
          title="Total"
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

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          padding: 50,
        }}
      >
        <Pressable style={styles.addIcon} onPress={onSelectFile}>
          <MaterialCommunityIcons name="plus" size={60} />
        </Pressable>
        <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
      </View>

      <FormButton
      // isSubmitting={formik.isSubmitting}
      //  onPress={formik.handleSubmit}
      >
        <Text style={{ color: "#FFFFFF" }}>Submit</Text>
      </FormButton>
    </View>
  );
};

export default NewReimbursementForm;

const styles = StyleSheet.create({
  addIcon: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#E8E9EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
