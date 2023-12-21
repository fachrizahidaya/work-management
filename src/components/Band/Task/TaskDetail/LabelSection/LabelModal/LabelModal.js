import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Dimensions, Platform, Text, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import Modal from "react-native-modal";

import LabelItem from "../LabelItem/LabelItem";
import FormButton from "../../../../../shared/FormButton";
import { useDisclosure } from "../../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../../config/api";
import { useLoading } from "../../../../../../hooks/useLoading";
import Input from "../../../../../shared/Forms/Input";
import Button from "../../../../../shared/Forms/Button";

const LabelModal = ({ isOpen, onClose, projectId, taskId, allLabels = [], refetch, refetchTaskLabels }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const { isLoading, start, stop } = useLoading(false);

  const { isOpen: colorPickerIsOpen, toggle: toggleColorPicker } = useDisclosure(false);

  const addNewLabelFromInput = async (form, setSubmitting, setStatus) => {
    try {
      // Create a new label
      const res = await axiosInstance.post("/pm/labels", form);

      // Associate label with a project (if applicable)
      if (projectId) {
        await axiosInstance.post("/pm/projects/label", {
          project_id: projectId,
          label_id: res.data.data.id,
        });
      }

      // Associate label with the selected task
      await axiosInstance.post("/pm/tasks/label", {
        task_id: taskId,
        label_id: res.data.data.id,
      });
      setStatus("success");
      setSubmitting(false);
      refetch();
    } catch (error) {
      console.log(error);
      setStatus("error");
      setSubmitting(false);
    }
  };

  const assignLabelToTaskOnPress = async (labelId) => {
    try {
      start();
      // Associate the label with the selected task
      await axiosInstance.post("/pm/tasks/label", {
        task_id: taskId,
        label_id: labelId,
      });
      refetchTaskLabels();
      stop();
    } catch (error) {
      console.log(error);
      stop();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      color: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Label name is required"),
      color: yup.string().required("Label color is required").notOneOf(["#ffffff"], "White color is not allowed"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      addNewLabelFromInput(values, setSubmitting, setStatus);
    },
  });

  const onColorPicked = (color) => {
    formik.setFieldValue("color", color);
    // If selected color is not white (default) then close the color picker after color picked
    if (color !== "#ffffff") {
      toggleColorPicker();
    }
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onClose(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);
  return (
    <Modal
      avoidKeyboard={true}
      isVisible={isOpen}
      onBackdropPress={() => onClose(formik.resetForm)}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <View>
          <Text style={{ fontWeight: 500 }}>New Label</Text>
        </View>

        <View style={{ display: "flex", gap: 10 }}>
          {allLabels.length > 0 && (
            <>
              <Text style={{ fontWeight: 500 }}>Select from labels:</Text>
              <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
                {allLabels.map((label) => {
                  return (
                    <LabelItem
                      disabled={isLoading}
                      key={label.id}
                      id={label.label_id}
                      name={label.label_name}
                      color={label.label_color}
                      onPress={assignLabelToTaskOnPress}
                    />
                  );
                })}
              </View>
            </>
          )}

          <Input
            formik={formik}
            title="Create new label"
            value={formik.values.name}
            fieldName="name"
            placeHolder="Type anything..."
            onChangeText={(value) => formik.setFieldValue("name", value)}
          />

          <View style={{ display: "flex", gap: 10 }}>
            <Text style={{ fontWeight: 500, color: formik.errors.color ? "red" : "black" }}>Select label color</Text>

            <Button onPress={toggleColorPicker} backgroundColor={formik.values.color || "#f8f8f8"}>
              <Text> {colorPickerIsOpen ? "Close color picker" : "Pick a color"}</Text>
            </Button>
          </View>
        </View>

        <View>
          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "white", fontWeight: 500 }}>Save</Text>
          </FormButton>
        </View>

        {colorPickerIsOpen && (
          <ColorPicker
            sliderHidden={true}
            swatches={false}
            onColorChangeComplete={(color) => {
              onColorPicked(color);
            }}
            thumbSize={40}
          />
        )}
      </View>
    </Modal>
  );
};

export default LabelModal;
