import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Actionsheet, Flex, FormControl, Icon, Input, Slider, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import { useFetch } from "../../../../../hooks/useFetch";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import axiosInstance from "../../../../../config/api";
import FormButton from "../../../../shared/FormButton";
import { useKeyboardChecker } from "../../../../../hooks/useKeyboardChecker";
import CheckListItem from "./CheckListItem/CheckListItem";
import ConfirmationModal from "../../../../shared/ConfirmationModal";

const ChecklistSection = ({ taskId }) => {
  const toast = useToast();
  const { isKeyboardVisible } = useKeyboardChecker();
  const [selectedChecklist, setSelectedChecklist] = useState({});
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: deleteChecklistModalIsOpen, toggle: toggleDeleteChecklist } = useDisclosure(false);
  const { data: checklists, refetch: refetchChecklists } = useFetch(`/pm/tasks/${taskId}/checklist`);

  const onCloseActionSheet = (resetForm) => {
    toggle();
    resetForm();
  };

  const openDeleteModal = (id) => {
    toggleDeleteChecklist();

    const filteredChecklist = checklists?.data.filter((item) => {
      return item.id === id;
    });

    setSelectedChecklist(filteredChecklist[0]);
  };

  /**
   * Calculate finished checklists
   */
  const finishChecklists = checklists?.data.filter((item) => {
    return item.status === "Finish";
  });

  /**
   * Handles add new checklist
   * @param {Object} form - Form to submit
   */
  const newChecklistHandler = async (form, setStatus, setSubmitting) => {
    try {
      await axiosInstance.post("/pm/tasks/checklist", { ...form, task_id: taskId, status: "Open" });
      refetchChecklists();
      setStatus("success");
      setSubmitting(false);
      toast.show({
        render: () => {
          return <SuccessToast message={"New checklist added"} />;
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

  const checkAndUncheckChecklist = async (checklistId, currentStatus) => {
    try {
      await axiosInstance.patch(`/pm/tasks/checklist/${checklistId}`, {
        status: currentStatus === "Open" ? "Finish" : "Open",
      });
      refetchChecklists();
      toast.show({
        render: () => {
          return <SuccessToast message={currentStatus === "Open" ? "Checklist checked" : "Checklist unchecked"} />;
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
      title: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Checklist title is required"),
    }),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setStatus("processing");
      newChecklistHandler(values, setStatus, setSubmitting);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onCloseActionSheet(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <>
      <FormControl>
        <FormControl.Label>CHECKLIST ({(finishChecklists.length / checklists?.data?.length) * 100}%)</FormControl.Label>
        <Slider
          value={(finishChecklists.length / checklists?.data?.length) * 100}
          size="sm"
          colorScheme="blue"
          w="100%"
        >
          <Slider.Track bg="blue.100">
            <Slider.FilledTrack bg="blue.600" />
          </Slider.Track>
          <Slider.Thumb borderWidth="0" bg="transparent" display="none"></Slider.Thumb>
        </Slider>

        {checklists?.data?.length > 0 &&
          checklists.data.map((checklist) => {
            return (
              <CheckListItem
                key={checklist.id}
                id={checklist.id}
                title={checklist.title}
                status={checklist.status}
                onPress={checkAndUncheckChecklist}
                onPressDelete={openDeleteModal}
              />
            );
          })}

        <TouchableOpacity onPress={toggle}>
          <Flex flexDir="row" alignItems="center" gap={3}>
            <Icon as={<MaterialCommunityIcons name="plus" />} color="blue.600" size="md" />
            <Text color="blue.600">Add checklist item</Text>
          </Flex>
        </TouchableOpacity>
      </FormControl>

      <Actionsheet isOpen={isOpen} onClose={() => onCloseActionSheet(formik.resetForm)}>
        <Actionsheet.Content>
          <VStack w="100%" pb={isKeyboardVisible ? 580 : 0} space={2}>
            <FormControl.Label justifyContent="center">Add New Checklist</FormControl.Label>

            <FormControl isInvalid={formik.errors.title}>
              <Input
                placeholder="Cost Title"
                value={formik.values.title}
                onChangeText={(value) => formik.setFieldValue("title", value)}
              />
              <FormControl.ErrorMessage>{formik.errors.title}</FormControl.ErrorMessage>
            </FormControl>

            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text color="white">Save</Text>
            </FormButton>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>

      <ConfirmationModal
        isOpen={deleteChecklistModalIsOpen}
        toggle={toggleDeleteChecklist}
        apiUrl={`/pm/tasks/checklist/${selectedChecklist?.id}`}
        successMessage="Checklist deleted"
        header="Delete Checklist"
        description={`Are you sure to delete ${selectedChecklist?.title}?`}
        hasSuccessFunc={true}
        onSuccess={refetchChecklists}
      />
    </>
  );
};

export default ChecklistSection;
