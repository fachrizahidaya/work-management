import React, { memo, useEffect, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { Dimensions, Platform, Text, View, Pressable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { useFetch } from "../../../../../hooks/useFetch";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import FormButton from "../../../../shared/FormButton";
import axiosInstance from "../../../../../config/api";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import Input from "../../../../shared/Forms/Input";

const CostSection = ({ taskId, disabled }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const [selectedCost, setSelectedChecklist] = useState({});
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: deleteCostModalisOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { data: costs, refetch: refechCosts } = useFetch(`/pm/tasks/${taskId}/cost`);

  const onCloseActionSheet = (resetForm) => {
    toggle();
    resetForm();
  };

  const openDeleteModal = (id) => {
    toggle();

    setTimeout(toggleDeleteModal, 500);

    const filteredCost = costs?.data.filter((item) => {
      return item.id === id;
    });

    setSelectedChecklist(filteredCost[0]);
  };

  /**
   * Handles the addition of a new cost associated with a task.
   * @param {Object} form - The form containing cost-related data to be added.
   */
  const newCostHandler = async (form, setStatus, setSubmitting) => {
    try {
      await axiosInstance.post("/pm/tasks/cost", { ...form, task_id: taskId });
      setStatus("success");
      setSubmitting(false);
      refechCosts();

      Toast.show({
        type: "success",
        text1: "Cost added",
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

  const formik = useFormik({
    initialValues: {
      cost_name: "",
      cost_amount: "",
    },
    validationSchema: yup.object().shape({
      cost_name: yup.string().required("Cost detail is required").max(50, "50 characters max"),
      cost_amount: yup.number().required("Cost amount is required"),
    }),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setStatus("processing");
      newCostHandler(values, setStatus, setSubmitting);
    },
  });

  /**
   * Sum all task's costs
   */
  const totalCostCalculation = costs?.data.reduce((cost, object) => {
    return cost + object.cost_amount;
  }, 0);

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      onCloseActionSheet(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <>
      <View style={{ display: "flex", gap: 10 }}>
        <Text style={{ fontWeight: 500 }}>COST</Text>
        <View style={{ position: "relative" }}>
          <Pressable
            onPress={toggle}
            style={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />

          <Input
            value={`Rp ${totalCostCalculation?.toLocaleString() || 0}`}
            placeHolder="Task's cost"
            editable={false}
          />
        </View>

        <Modal
          avoidKeyboard={true}
          isVisible={isOpen}
          onBackdropPress={() => onCloseActionSheet(formik.resetForm)}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
        >
          <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <View style={{ display: "flex", gap: 10 }}>
              {costs?.data.length > 0 ? (
                <ScrollView style={{ maxHeight: 200 }}>
                  <View style={{ flex: 1, minHeight: 2 }}>
                    <FlashList
                      data={costs?.data}
                      keyExtractor={(item) => item?.id}
                      estimatedItemSize={25}
                      renderItem={({ item }) => (
                        <View
                          key={item.id}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={{ fontSize: 16 }}>{item.cost_name} - </Text>
                            <Text style={{ fontSize: 16 }}>Rp {item.cost_amount.toLocaleString()}</Text>
                          </View>

                          <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
                            <MaterialCommunityIcons name="delete-outline" size={20} />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                </ScrollView>
              ) : (
                <Text style={{ fontWeight: 500 }}>This task has no cost yet.</Text>
              )}

              {!disabled && (
                <>
                  <View style={{ flex: 1, borderWidth: 1, borderColor: "#E8E9EB" }} />
                  <View style={{ display: "flex", gap: 5 }}>
                    <Input
                      placeHolder="Cost Title"
                      value={formik.values.cost_name}
                      fieldName="cost_name"
                      formik={formik}
                    />

                    <Input
                      keyboardType="numeric"
                      placeHolder="Cost Amount"
                      value={formik.values.cost_amount}
                      formik={formik}
                      fieldName="cost_amount"
                    />
                    <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                      <Text style={{ color: "white" }}>Save</Text>
                    </FormButton>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <ConfirmationModal
          isOpen={deleteCostModalisOpen}
          toggle={toggleDeleteModal}
          apiUrl={`/pm/tasks/cost/${selectedCost?.id}`}
          successMessage="Cost deleted"
          header="Delete Cost"
          description={`Are you sure to delete ${selectedCost?.cost_name}?`}
          hasSuccessFunc={true}
          onSuccess={refechCosts}
        />

        <Toast position="bottom" />
      </View>
    </>
  );
};

export default memo(CostSection);
