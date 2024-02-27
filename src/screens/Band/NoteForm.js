import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import { useFormik } from "formik";
import * as yup from "yup";
import Toast from "react-native-root-toast";

import { Dimensions, Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { ScrollView } from "react-native-gesture-handler";

import axiosInstance from "../../config/api";
import FormButton from "../../components/shared/FormButton";
import PageHeader from "../../components/shared/PageHeader";
import Input from "../../components/shared/Forms/Input";
import useCheckAccess from "../../hooks/useCheckAccess";
import { ErrorToastProps, SuccessToastProps } from "../../components/shared/CustomStylings";

const NoteForm = ({ route }) => {
  const { noteData } = route.params;
  const richText = useRef();
  const { width, height } = Dimensions.get("window");
  const editCheckAccess = useCheckAccess("update", "Notes");
  const navigation = useNavigation();

  const submitHandler = async (form, setSubmitting, setStatus) => {
    try {
      if (noteData?.id) {
        await axiosInstance.patch(`/pm/notes/${noteData.id}`, form);
      } else {
        await axiosInstance.post("/pm/notes", form);
      }

      setSubmitting(false);
      setStatus("success");
      Toast.show("New note saved", SuccessToastProps);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  const formik = useFormik({
    enableReinitialize: noteData ? true : false,
    initialValues: {
      title: noteData?.title || "",
      content: noteData?.content || "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Note title is required"),
      content: yup.string().required("Content is required"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      submitHandler({ ...values, pinned: noteData ? noteData.pinned : false }, setSubmitting, setStatus);
    },
  });

  // To change empty p tag to br tag
  const preprocessContent = (content) => {
    return content.replace(/<p><\/p>/g, "<br/>");
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          width: width,
          height: height,
          paddingVertical: 13,
          paddingHorizontal: 16,
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <PageHeader
          title="New Note"
          onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack()}
        />

        <View style={{ display: "flex", gap: 17, marginTop: 22, flex: 1, paddingBottom: 40 }}>
          <Input
            formik={formik}
            title="Title"
            fieldName="title"
            value={formik.values.title}
            placeHolder="Input note title..."
          />

          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.setStrikethrough,
              actions.setUnderline,
            ]}
            iconTint="#000"
            selectedIconTint="#176688"
          />

          <View style={{ flex: 1 }}>
            <RichEditor
              ref={richText}
              onChange={(descriptionText) => {
                formik.setFieldValue("content", descriptionText);
              }}
              initialContentHTML={preprocessContent(formik.values.content)}
              style={{ flex: 1, borderWidth: 0.5, borderRadius: 10, borderColor: "#E8E9EB" }}
              editorStyle={{
                contentCSSText: `
                  display: flex; 
                  flex-direction: column; 
                  min-height: 200px; 
                  position: absolute; 
                  top: 0; right: 0; bottom: 0; left: 0;`,
              }}
            />
          </View>

          {editCheckAccess && (
            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text style={{ color: "white" }}>{noteData ? "Save" : "Create"}</Text>
            </FormButton>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NoteForm;
