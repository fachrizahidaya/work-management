import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { TouchableOpacity } from "react-native";
import { Actionsheet, Button, Flex, HStack, Icon, Menu, Spinner, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useLoading } from "../../../../../hooks/useLoading";
import useCheckAccess from "../../../../../hooks/useCheckAccess";

const ControlSection = ({
  taskStatus,
  selectedTask,
  refetchResponsible,
  responsible,
  openEditForm,
  refetchTask,
  disabled,
}) => {
  const navigation = useNavigation();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: sheetIsOpen, toggle: toggleSheet } = useDisclosure(false);
  const { isLoading, toggle: toggleLoading } = useLoading(false);
  const editCheckAccess = useCheckAccess("update", "Tasks");
  const deleteCheckAccess = useCheckAccess("delete", "Tasks");
  const isDisabled = taskStatus === "Closed";

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

  /**
   * Handles change task status
   */
  const changeTaskStatus = async (status) => {
    try {
      toggleLoading();
      await axiosInstance.post(`/pm/tasks/${status}`, {
        id: selectedTask?.id,
      });
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Task ${status}ed`} close={() => toast.close(id)} />;
        },
      });
      toggleLoading();
      toggleSheet();
      refetchTask();
    } catch (error) {
      console.log(error);
      toggleLoading();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
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
              <TouchableOpacity {...triggerProps} disabled={disabled}>
                <Icon as={<MaterialCommunityIcons name="dots-horizontal" />} size="xl" color="#3F434A" />
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

        <Button
          size="md"
          disabled={isDisabled || selectedTask?.responsible_id !== userSelector.id}
          bgColor={isDisabled || selectedTask?.responsible_id !== userSelector.id ? "gray.500" : "primary.600"}
          onPress={toggleSheet}
        >
          <Flex flexDir="row" alignItems="center" gap={1}>
            {isLoading ? <Spinner size="sm" color="white" /> : <Text color="white">{taskStatus}</Text>}
          </Flex>
        </Button>
      </HStack>

      <Actionsheet isOpen={sheetIsOpen} onClose={toggleSheet}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={() => changeTaskStatus("open")} disabled={isLoading}>
            Open
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => changeTaskStatus("start")} disabled={isLoading}>
            On Progress
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => changeTaskStatus("finish")} disabled={isLoading}>
            Finish
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

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
