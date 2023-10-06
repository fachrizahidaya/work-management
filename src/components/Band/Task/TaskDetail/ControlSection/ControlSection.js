import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { TouchableOpacity } from "react-native";
import { Button, Flex, HStack, Icon, Menu, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import ConfirmationModal from "../../../../shared/ConfirmationModal";

const ControlSection = ({ taskStatus, selectedTask, refetchResponsible, responsible, openEditForm, refetchTask }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const isDisabled = taskStatus === "Finish" || taskStatus === "Closed";

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

  /**
   * Handles change task status
   */
  const changeTaskStatus = async (status) => {
    try {
      await axiosInstance.post(`/pm/tasks/${status}`, {
        id: selectedTask?.id,
      });
      toast.show({
        render: () => {
          return <SuccessToast message={`Task ${status}ed`} />;
        },
      });
      refetchTask();
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
          <Menu.Item onPress={openEditForm}>Edit</Menu.Item>
          <Menu.Item onPress={toggleDeleteModal}>
            <Text color="red.600">Delete</Text>
          </Menu.Item>
        </Menu>

        <Menu
          w="160"
          trigger={(triggerProps) => {
            return (
              <Button
                size="md"
                {...triggerProps}
                disabled={isDisabled}
                bgColor={isDisabled ? "gray.500" : "primary.600"}
              >
                <Flex flexDir="row" alignItems="center" gap={1}>
                  <Text color="white">{taskStatus}</Text>
                </Flex>
              </Button>
            );
          }}
        >
          {taskStatus === "Open" ? (
            <Menu.Item onPress={() => changeTaskStatus("start")}>Start</Menu.Item>
          ) : (
            <Menu.Item onPress={() => changeTaskStatus("finish")}>Finish</Menu.Item>
          )}
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
        onSuccess={() => navigation.goBack()}
      />
    </>
  );
};

export default memo(ControlSection);
