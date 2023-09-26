import React, { memo, useEffect, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";

import {
  Actionsheet,
  Box,
  Divider,
  Flex,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";

import { useFetch } from "../../../../../hooks/useFetch";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import FormButton from "../../../../shared/FormButton";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import { useKeyboardChecker } from "../../../../../hooks/useKeyboardChecker";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { Platform } from "react-native";

const CostSection = ({ taskId, disabled }) => {
  const toast = useToast();
  const [selectedCost, setSelectedChecklist] = useState({});
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: deleteCostModalisOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();
  const { data: costs, refetch: refechCosts } = useFetch(`/pm/tasks/${taskId}/cost`);

  const onCloseActionSheet = (resetForm) => {
    toggle();
    resetForm();
  };

  const openDeleteModal = (id) => {
    toggleDeleteModal();

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
      toast.show({
        render: () => {
          return <SuccessToast message={"New cost added"} />;
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
        <Pressable
          onPress={() => {
            Platform.OS === "android" && onCloseActionSheet(formik.resetForm);
          }}
        >
          <Input
            onPressOut={() => {
              Platform.OS === "ios" && onCloseActionSheet(formik.resetForm);
            }}
            isReadOnly
            value={`Rp ${totalCostCalculation?.toLocaleString()}`}
            placeholder="Task's cost"
            editable={false}
          />
        </Pressable>
      </FormControl>

      <Actionsheet isOpen={isOpen} onClose={() => onCloseActionSheet(formik.resetForm)}>
        <Actionsheet.Content>
          <VStack w="95%" space={3} pb={keyboardHeight}>
            {costs?.data.length > 0 ? (
              <ScrollView style={{ maxHeight: 200 }}>
                <Box flex={1} minHeight={2}>
                  <FlashList
                    data={costs?.data}
                    keyExtractor={(item) => item?.id}
                    estimatedItemSize={200}
                    renderItem={({ item }) => (
                      <Flex key={item.id} flexDir="row" justifyContent="space-between" alignItems="center">
                        <HStack>
                          <Text fontSize={16}>{item.cost_name} - </Text>
                          <Text fontSize={16}>Rp {item.cost_amount.toLocaleString()}</Text>
                        </HStack>

                        <IconButton
                          onPress={() => openDeleteModal(item.id)}
                          rounded="full"
                          icon={
                            <Icon as={<MaterialCommunityIcons name="delete-outline" />} size="md" color="gray.600" />
                          }
                        />
                      </Flex>
                    )}
                  />
                </Box>
              </ScrollView>
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
                      keyboardType="numeric"
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

      <ConfirmationModal
        isOpen={deleteCostModalisOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/pm/tasks/cost/${selectedCost?.id}`}
        successMessage="Cost deleted"
        header="Delete Cost"
        description={`Are you sure to delete ${selectedCost?.title}?`}
        hasSuccessFunc={true}
        onSuccess={refechCosts}
      />
    </>
  );
};

export default memo(CostSection);
