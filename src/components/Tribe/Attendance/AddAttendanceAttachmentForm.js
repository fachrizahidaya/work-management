import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import { TextProps } from "../../shared/CustomStylings";
import FormButton from "../../shared/FormButton";
import Input from "../../shared/Forms/Input";

const AddAttendanceAttachmentForm = ({
  formik,
  onChangeStartDate,
  month,
  onChangeEndDate,
  onSelectFile,
  fileAttachment,
}) => {
  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Input formik={formik} title="Title" fieldName="title" placeHolder="Input title" value={formik.values.title} />

      {Platform.OS === "android" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 5, width: "45%" }}>
            <CustomDateTimePicker
              unlimitStartDate={true}
              defaultValue={formik.values.begin_date}
              onChange={onChangeStartDate}
              month={month}
              title="Start Date"
            />
            {!formik.errors.begin_date ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.begin_date}</Text>
            )}
          </View>
          <View style={{ gap: 5, width: "45%" }}>
            <CustomDateTimePicker
              defaultValue={formik.values.end_date}
              onChange={onChangeEndDate}
              month={month}
              title="End Date"
            />
            {!formik.errors.end_date ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.end_date}</Text>
            )}
          </View>
        </View>
      ) : (
        <>
          <View style={{ gap: 5 }}>
            <CustomDateTimePicker
              unlimitStartDate={true}
              width="100%"
              defaultValue={formik.values.begin_date}
              onChange={onChangeStartDate}
              month={month}
              title="Start Date"
            />
            {!formik.errors.begin_date ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.begin_date}</Text>
            )}
          </View>
          <View style={{ gap: 5 }}>
            <CustomDateTimePicker
              width="100%"
              defaultValue={formik.values.end_date}
              onChange={onChangeEndDate}
              month={month}
              title="End Date"
            />
            {!formik.errors.end_date ? null : (
              <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.end_date}</Text>
            )}
          </View>
        </>
      )}

      <View style={{ gap: 5 }}>
        <Text style={[{ fontSize: 14 }, TextProps]}>Attachment</Text>
        <Pressable onPress={onSelectFile} style={styles.attachment}>
          <Text
            style={[
              {
                fontSize: 12,
                opacity: 0.5,
                overflow: "hidden",
                width: 300,
              },
              TextProps,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {!fileAttachment ? "Upload image or .pdf" : fileAttachment?.name}
          </Text>
          <MaterialCommunityIcons
            name="attachment"
            size={20}
            style={{ transform: [{ rotate: "-35deg" }] }}
            color="#3F434A"
          />
        </Pressable>
        {!formik.errors.attachment ? null : (
          <Text style={{ fontSize: 14, color: "red" }}>{formik.errors.attachment}</Text>
        )}
      </View>

      {!formik.values.attachment || !formik.values.title || !formik.values.begin_date || !formik.values.end_date ? (
        <FormButton opacity={0.5} disabled={true}>
          {
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#FFFFFF",
              }}
            >
              Submit
            </Text>
          }
        </FormButton>
      ) : (
        <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
          {
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#FFFFFF",
              }}
            >
              Submit
            </Text>
          }
        </FormButton>
      )}
    </View>
  );
};

export default AddAttendanceAttachmentForm;

const styles = StyleSheet.create({
  attachment: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E8E9EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
