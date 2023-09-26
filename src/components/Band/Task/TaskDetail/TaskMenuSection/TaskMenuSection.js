import React, { memo } from "react";

import { useSelector } from "react-redux";

import { HStack, Icon, IconButton, Menu, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";

const TaskMenuSection = ({
  selectedTask,
  onCloseDetail,
  openEditForm,
  responsible,
  refetchResponsible,
  refetchAllTasks,
}) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, toggle: toggleDeleteModal } = useDisclosure(false);

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
        await axiosInstance.patch(`/pm/tasks/responsible/${responsible.id}`, {
          user_id: userSelector.id,
        });
      }
      refetchResponsible();
      refetchAllTasks();
      toast.show({
        render: () => {
          return <SuccessToast message={`Task assigned`} />;
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
  return (
    <>
      <HStack space={2}>
        <Menu
          trigger={(triggerProps) => {
            return (
              <IconButton
                {...triggerProps}
                size="lg"
                borderRadius="full"
                icon={<Icon as={<MaterialCommunityIcons name="dots-horizontal" />} color="black" />}
              />
            );
          }}
        >
          <Menu.Item onPress={takeTask}>Take task</Menu.Item>
          <Menu.Item onPress={() => openEditForm(selectedTask)}>Edit</Menu.Item>
          <Menu.Item onPress={toggleDeleteModal}>
            <Text color="red.600">Delete</Text>
          </Menu.Item>
        </Menu>

        <IconButton
          onPress={onCloseDetail}
          size="lg"
          borderRadius="full"
          icon={<Icon as={<MaterialCommunityIcons name="chevron-right" />} color="black" />}
        />
      </HStack>

      <ConfirmationModal
        isOpen={isOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/pm/tasks/${selectedTask?.id}`}
        successMessage="Task deleted"
        header="Delete Task"
        description={`Are you sure to delete ${selectedTask?.title}?`}
        hasSuccessFunc={true}
        onSuccess={() => {
          refetchAllTasks();
          onCloseDetail();
        }}
      />
    </>
  );
};

export default memo(TaskMenuSection);
