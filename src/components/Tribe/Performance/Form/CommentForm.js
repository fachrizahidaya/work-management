import React from "react";

import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";

import Input from "../../../shared/Forms/Input";

const CommentForm = ({
  reference,
  description,
  formik,
  handleClose,
  onChange,
  comment,
  commentValue,
}) => {
  return (
    <ActionSheet ref={reference}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            display: "flex",
            gap: 21,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Comment</Text>
            <TouchableOpacity
              onPress={() => {
                if (comment == formik.values.comment) {
                  null;
                } else {
                  formik.handleSubmit();
                  handleClose();
                }
              }}
            >
              <Text
                style={{ opacity: comment == formik.values.comment ? 0.5 : 1 }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <Text>{description}</Text>

          <Input
            formik={formik}
            title="Comment"
            multiline={true}
            fieldName="comment"
            value={formik.values.comment}
            placeHolder="Input Comment"
            onChangeText={(value) => {
              formik.setFieldValue("comment", value);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default CommentForm;
