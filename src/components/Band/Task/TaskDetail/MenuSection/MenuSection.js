import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { TouchableOpacity } from "react-native";
import { Icon, Menu, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import useCheckAccess from "../../../../../hooks/useCheckAccess";

const MenuSection = ({ selectedTask, refetchResponsible, responsible, openEditForm, disabled }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const editCheckAccess = useCheckAccess("update", "Tasks");
  const deleteCheckAccess = useCheckAccess("delete", "Tasks");

  /**
   * Handles take task as responsible
   */
  const takeTask = async () => {
    try {
      if (!selectedTask.responsible_id) {
        await axiosInstance.post("/pm/tasks/responsible", {
          task_id: selectedTask.id,
          user_id: userSelector.id,
        });
      } else {
        // Update the responsible user if it already exists
        await axiosInstance.patch(`/pm/tasks/responsible/${responsible[0].id}`, {
          user_id: userSelector.id,
        });
      }
      refetchResponsible();
      refetchTask();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Task assigned`} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };
  return (
    <>
      <Menu
        trigger={(triggerProps) => {
          return (
            <TouchableOpacity {...triggerProps} disabled={disabled}>
              <Icon
                as={<MaterialCommunityIcons name="dots-vertical" />}
                size="xl"
                color="#3F434A"
                opacity={disabled ? 0.5 : 1}
              />
            </TouchableOpacity>
          );
        }}
      >
        <Menu.Item onPress={takeTask}>Take task</Menu.Item>
        {editCheckAccess && <Menu.Item onPress={openEditForm}>Edit</Menu.Item>}
        {deleteCheckAccess && (
          <Menu.Item onPress={toggleDeleteModal}>
            <Text color="red.600">Delete</Text>
          </Menu.Item>
        )}
      </Menu>

      <ConfirmationModal
        isOpen={isOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/pm/tasks/${selectedTask?.id}`}
        successMessage="Task deleted"
        header="Delete Task"
        description={`Are you sure to delete ${selectedTask?.title}?`}
        hasSuccessFunc={true}
        onSuccess={() => navigation.goBack()}
      />
    </>
  );
};

export default memo(MenuSection);
