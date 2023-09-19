import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import { Actionsheet, Divider, FormControl, HStack, Input, Text, VStack } from "native-base";

import { useFetch } from "../../../../../hooks/useFetch";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import FormButton from "../../../../shared/FormButton";
import axiosInstance from "../../../../../config/api";

const CostSection = ({ taskId, disabled }) => {
  const { isOpen, toggle } = useDisclosure(false);
  const { data: costs, refetch: refechCosts } = useFetch(`/pm/tasks/${taskId}/cost`);

  const onCloseActionSheet = (resetForm) => {
    toggle();
    resetForm();
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
    } catch (error) {
      console.log(error);
      setStatus("error");
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
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
      <FormControl>
        <FormControl.Label>COST</FormControl.Label>
        <Input
          isReadOnly
          value={`Rp ${totalCostCalculation?.toLocaleString()}`}
          onPressOut={() => onCloseActionSheet(formik.resetForm)}
          placeholder="Task's cost"
          editable={false}
        />
      </FormControl>

      <Actionsheet isOpen={isOpen} onClose={() => onCloseActionSheet(formik.resetForm)}>
        <Actionsheet.Content>
          <VStack w="95%" space={3}>
            {costs?.data?.length > 0 ? (
              costs?.data.map((cost) => {
                return (
                  <HStack key={cost.id}>
                    <Text fontSize={16}>{cost.cost_name} - </Text>
                    <Text fontSize={16}>Rp {cost.cost_amount.toLocaleString()}</Text>
                  </HStack>
                );
              })
            ) : (
              <Actionsheet.Item isDisabled>This task has no cost yet.</Actionsheet.Item>
            )}

            {!disabled && (
              <>
                <Divider orientation="horizontal" />
                <VStack w="100%" space={2}>
                  <FormControl.Label justifyContent="center">Add New Cost</FormControl.Label>

                  <FormControl isInvalid={formik.errors.cost_name}>
                    <Input
                      placeholder="Cost Title"
                      value={formik.values.cost_name}
                      onChangeText={(value) => formik.setFieldValue("cost_name", value)}
                    />
                    <FormControl.ErrorMessage>{formik.errors.cost_name}</FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={formik.errors.cost_amount}>
                    <Input
                      placeholder="Cost Amount"
                      value={formik.values.cost_amount}
                      onChangeText={(value) => formik.setFieldValue("cost_amount", value)}
                    />
                    <FormControl.ErrorMessage>{formik.errors.cost_amount}</FormControl.ErrorMessage>
                  </FormControl>
                  <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                    <Text color="white">Save</Text>
                  </FormButton>
                </VStack>
              </>
            )}
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default CostSection;
