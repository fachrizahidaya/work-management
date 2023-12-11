import React, { memo } from "react";

import { FormControl, Icon, Flex, useToast, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../../hooks/useFetch";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import LabelModal from "./LabelModal/LabelModal";
import LabelItem from "./LabelItem/LabelItem";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import { useJoinWithNoDuplicate } from "../../../../../hooks/useJoinWithNoDuplicate";
import { useLoading } from "../../../../../hooks/useLoading";
import { TouchableOpacity } from "react-native";

const LabelSection = ({ projectId, taskId, disabled }) => {
  const toast = useToast();
  const { isLoading, start, stop } = useLoading(false);

  // Handles label modal
  const { isOpen: modalIsOpen, open: openModal, close: closeModal } = useDisclosure(false);

  const onCloseModal = (resetForm) => {
    closeModal();
    resetForm();
  };

  // Fetch projects labels
  const { data: projectLabels, refetch: refetchProjectLabels } = useFetch(
    projectId && `/pm/projects/${projectId}/label`
  );

  // Fetch selected tasks labels
  const { data: taskLabels, refetch: refetchTaskLabels } = useFetch(taskId && `/pm/tasks/${taskId}/label`);

  // Join labels with no duplicates
  const { result: labelArr } = useJoinWithNoDuplicate(
    projectLabels?.data,
    taskLabels?.data,
    "label_name",
    "label_name"
  );

  const refetch = () => {
    refetchProjectLabels();
    refetchTaskLabels();
  };

  /**
   * handles remove label from task
   */
  const removeLabel = async (labelId) => {
    try {
      start();
      await axiosInstance.delete(`/pm/tasks/label/${labelId}`);
      refetchTaskLabels();
      stop();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Label removed"} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      stop();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };

  return (
    <>
      {(!disabled || (disabled && taskLabels?.data?.length > 0)) && (
        <FormControl>
          <FormControl.Label>LABELS</FormControl.Label>
          {taskLabels?.data.length > 0 ? (
            <>
              <Flex flexDir="row" alignItems="center" gap={1}>
                {taskLabels.data.map((label) => (
                  <LabelItem
                    disabled={isLoading || disabled}
                    key={label.id}
                    id={label.id}
                    color={label.label_color}
                    name={label.label_name}
                    onPress={removeLabel}
                  />
                ))}

                {!disabled && (
                  <TouchableOpacity
                    onPress={openModal}
                    style={{
                      backgroundColor: "#f1f2f3",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      borderRadius: 10,
                    }}
                  >
                    <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
                  </TouchableOpacity>
                )}
              </Flex>
              {!disabled && (
                <Text color="gray.500" mt={1}>
                  Press any label to remove.
                </Text>
              )}
            </>
          ) : (
            !disabled && (
              <TouchableOpacity
                onPress={openModal}
                style={{
                  backgroundColor: "#f1f2f3",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 10,
                }}
              >
                <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
              </TouchableOpacity>
            )
          )}
        </FormControl>
      )}

      {modalIsOpen && (
        <LabelModal
          isOpen={modalIsOpen}
          onClose={onCloseModal}
          projectId={projectId}
          taskId={taskId}
          allLabels={labelArr}
          refetch={refetch}
          refetchTaskLabels={refetchTaskLabels}
        />
      )}
    </>
  );
};

export default memo(LabelSection);
