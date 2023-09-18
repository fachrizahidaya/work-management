import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Button, Flex, FormControl, Input, Modal, Text, useToast } from "native-base";
import ColorPicker from "react-native-wheel-color-picker";

import LabelItem from "../LabelItem/LabelItem";
import FormButton from "../../../../../shared/FormButton";
import { useDisclosure } from "../../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../../shared/ToastDialog";

const LabelModal = ({ isOpen, onClose, projectId, taskId, allLabels = [], refetch, refetchTaskLabels }) => {
  const toast = useToast();
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

      toast.show({
        render: () => {
          return <SuccessToast message={"Label added"} />;
        },
      });
    } catch (error) {
      console.log(error);
      setStatus("error");
      setSubmitting(false);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  const assignLabelToTaskOnPress = async (labelId) => {
    try {
      // Associate the label with the selected task
      await axiosInstance.post("/pm/tasks/label", {
        task_id: taskId,
        label_id: labelId,
      });
      refetchTaskLabels();
      toast.show({
        render: () => {
          return <SuccessToast message={"Label added"} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
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
    <Modal isOpen={isOpen} onClose={() => onClose(formik.resetForm)}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>New Label</Modal.Header>
        <Modal.Body>
          {allLabels.length > 0 && (
            <>
              <FormControl.Label>Select from labels:</FormControl.Label>
              <Flex flexDir="row" flexWrap="wrap" gap={1}>
                {allLabels.map((label) => {
                  return (
                    <LabelItem
                      key={label.id}
                      id={label.label_id}
                      name={label.label_name}
                      color={label.label_color}
                      onPress={assignLabelToTaskOnPress}
                    />
                  );
                })}
              </Flex>
            </>
          )}

          <FormControl isInvalid={formik.errors.name}>
            <FormControl.Label>Create new label</FormControl.Label>
            <Input
              value={formik.values.name}
              placeholder="Type anything..."
              onChangeText={(value) => formik.setFieldValue("name", value)}
            />
            <FormControl.ErrorMessage>{formik.errors.name}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.color}>
            <FormControl.Label>Select label color</FormControl.Label>
            <Button variant="outline" onPress={toggleColorPicker} bgColor={formik.values.color || "white"}>
              <Text> {colorPickerIsOpen ? "Close color picker" : "Pick a color"}</Text>
            </Button>
            {colorPickerIsOpen && (
              <ColorPicker
                sliderHidden={true}
                swatches={false}
                onColorChangeComplete={(color) => {
                  onColorPicked(color);
                }}
                thumbSize={40}
                sliderSize={40}
              />
            )}

            <FormControl.ErrorMessage>{formik.errors.color}</FormControl.ErrorMessage>
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text color="white">Save</Text>
          </FormButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default LabelModal;
