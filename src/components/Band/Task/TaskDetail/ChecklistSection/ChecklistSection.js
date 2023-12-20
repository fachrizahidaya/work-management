import React, { memo, useEffect, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Dimensions, Platform, Text, TouchableOpacity, View } from "react-native";
import { Bar } from "react-native-progress";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import { useFetch } from "../../../../../hooks/useFetch";
import axiosInstance from "../../../../../config/api";
import FormButton from "../../../../shared/FormButton";
import CheckListItem from "./CheckListItem/CheckListItem";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useLoading } from "../../../../../hooks/useLoading";
import Input from "../../../../shared/Forms/Input";

const ChecklistSection = ({ taskId, disabled }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const [selectedChecklist, setSelectedChecklist] = useState({});
  const { isOpen, toggle } = useDisclosure(false);
  const { isLoading, start, stop } = useLoading(false);
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

      Toast.show({
        type: "success",
        text1: "Checklist added",
      });
    } catch (error) {
      console.log(error);
      setStatus("error");
      setSubmitting(false);

      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  const checkAndUncheckChecklist = async (checklistId, currentStatus) => {
    try {
      start();
      await axiosInstance.patch(`/pm/tasks/checklist/${checklistId}`, {
        status: currentStatus === "Open" ? "Finish" : "Open",
      });
      refetchChecklists();
      stop();

      Toast.show({
        type: "success",
        text1: currentStatus === "Open" ? "Checklist checked" : "Checklist unchecked",
      });
    } catch (error) {
      console.log(error);
      stop();

      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Checklist title is required").max(30, "30 characters max!"),
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
      <View style={{ display: "flex", gap: 10 }}>
        <Text style={{ fontWeight: 500 }}>
          CHECKLIST ({(finishChecklists?.length / checklists?.data?.length || 0) * 100}%)
        </Text>

        <Bar
          progress={finishChecklists?.length / checklists?.data?.length || 0}
          color="#176688"
          borderColor="white"
          unfilledColor="#E8E9EB"
          width={null}
        />

        <ScrollView style={{ maxHeight: 200 }}>
          <View style={{ flex: 1, minHeight: 2 }}>
            <FlashList
              data={checklists?.data}
              keyExtractor={(item) => item?.id}
              extraData={isLoading}
              estimatedItemSize={30}
              renderItem={({ item }) => (
                <CheckListItem
                  id={item.id}
                  title={item.title}
                  status={item.status}
                  isLoading={isLoading}
                  onPress={checkAndUncheckChecklist}
                  onPressDelete={openDeleteModal}
                  disabled={disabled}
                />
              )}
            />
          </View>
        </ScrollView>

        {!disabled && (
          <TouchableOpacity onPress={toggle}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <MaterialCommunityIcons name="plus" size={20} color="#304FFD" />
              <Text style={{ fontWeight: 500, color: "#304FFD" }}>Add checklist item</Text>
            </View>
          </TouchableOpacity>
        )}

        <Toast />
      </View>

      <Modal
        avoidKeyboard={true}
        isVisible={isOpen}
        onBackdropPress={() => onCloseActionSheet(formik.resetForm)}
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
      >
        <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text style={{ alignSelf: "center", fontWeight: 500 }}>Add New Checklist</Text>

          <Input placeHolder="Check List Title" value={formik.values.title} formik={formik} fieldName="title" />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ fontWeight: 500, color: "white" }}>Save</Text>
          </FormButton>
        </View>
      </Modal>

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

export default memo(ChecklistSection);
