import { Text, TextArea } from "native-base";

const MentionInputs = ({ employees, formik, name, onMentionSelect, inputRef }) => {
  return (
    <>
      <TextArea
        height={300}
        variant="unstyled"
        placeholder="What is happening?"
        onChangeText={(value) => {
          formik.setFieldValue("content", value);
        }}
        value={formik.values.content}
        fontSize="lg"
        multiline={true}
      />
    </>
  );
};

export default MentionInputs;
