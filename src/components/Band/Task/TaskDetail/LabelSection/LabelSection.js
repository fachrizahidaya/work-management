import React, { memo } from "react";

import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import { useFetch } from "../../../../../hooks/useFetch";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import LabelModal from "./LabelModal/LabelModal";
import LabelItem from "./LabelItem/LabelItem";
import axiosInstance from "../../../../../config/api";
import { useJoinWithNoDuplicate } from "../../../../../hooks/useJoinWithNoDuplicate";
import { useLoading } from "../../../../../hooks/useLoading";
import { TextProps } from "../../../../shared/CustomStylings";

const LabelSection = ({ projectId, taskId, disabled }) => {
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
      Toast.show({
        type: "success",
        text1: "Label removed",
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

  return (
    <>
      {(!disabled || (disabled && taskLabels?.data?.length > 0)) && (
        <View style={{ flex: 1, display: "flex", gap: 10 }}>
          <Text style={[{ fontWeight: 500 }, TextProps]}>LABELS</Text>
          {taskLabels?.data.length > 0 ? (
            <>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
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
                    <MaterialCommunityIcons name="plus" size={20} color="#3F434A" />
                  </TouchableOpacity>
                )}
              </View>
              {!disabled && (
                <Text style={{ color: "gray", opacity: 0.5, marginTop: 2 }}>Press any label to remove.</Text>
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
                <MaterialCommunityIcons name="plus" size={20} color="#3F434A" />
              </TouchableOpacity>
            )
          )}

          <Toast position="bottom" />
        </View>
      )}

      <LabelModal
        isOpen={modalIsOpen}
        onClose={onCloseModal}
        projectId={projectId}
        taskId={taskId}
        allLabels={labelArr}
        refetch={refetch}
        refetchTaskLabels={refetchTaskLabels}
      />
    </>
  );
};

export default memo(LabelSection);
