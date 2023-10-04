import React, { memo } from "react";

import { useSelector } from "react-redux";

import { TouchableOpacity } from "react-native";
import { Button, Flex, HStack, Icon, Menu, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import ConfirmationModal from "../../../../shared/ConfirmationModal";

const ControlSection = ({ taskStatus, selectedTask, refetchResponsible, refetchAllTasks, openEditForm }) => {
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
      <HStack space={6} alignItems="center">
        <Menu
          trigger={(triggerProps) => {
            return (
              <TouchableOpacity {...triggerProps}>
                <Icon as={<MaterialCommunityIcons name="dots-horizontal" />} size="xl" color="#3F434A" />
              </TouchableOpacity>
            );
          }}
        >
          <Menu.Item onPress={takeTask}>Take task</Menu.Item>
          <Menu.Item onPress={() => openEditForm(selectedTask)}>Edit</Menu.Item>
          <Menu.Item onPress={toggleDeleteModal}>
            <Text color="red.600">Delete</Text>
          </Menu.Item>
        </Menu>

        <Menu
          w="160"
          trigger={(triggerProps) => {
            return (
              <Button size="md" {...triggerProps}>
                <Flex flexDir="row" alignItems="center" gap={1}>
                  <Text color="white">{taskStatus}</Text>
                </Flex>
              </Button>
            );
          }}
        >
          <Menu.Item>Open</Menu.Item>
          <Menu.Item>On Progress</Menu.Item>
          <Menu.Item>Finish</Menu.Item>
        </Menu>
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

export default memo(ControlSection);
