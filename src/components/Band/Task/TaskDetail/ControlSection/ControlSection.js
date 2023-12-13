import React, { memo } from "react";

import { useSelector } from "react-redux";

import { Actionsheet, Button, Flex, HStack, Spinner, Text, useToast } from "native-base";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";

import { useLoading } from "../../../../../hooks/useLoading";

const ControlSection = ({ taskStatus, selectedTask, refetchTask }) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { isOpen: sheetIsOpen, toggle: toggleSheet } = useDisclosure(false);
  const { isLoading, toggle: toggleLoading } = useLoading(false);
  const isDisabled = taskStatus === "Closed";

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
      <HStack>
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
          <Actionsheet.Item
            onPress={() => changeTaskStatus("open")}
            disabled={isLoading}
            _pressed={{ bgColor: "#f1f1f1" }}
          >
            Open
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => changeTaskStatus("start")}
            disabled={isLoading}
            _pressed={{ bgColor: "#f1f1f1" }}
          >
            On Progress
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => changeTaskStatus("finish")}
            disabled={isLoading}
            _pressed={{ bgColor: "#f1f1f1" }}
          >
            Finish
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default memo(ControlSection);
