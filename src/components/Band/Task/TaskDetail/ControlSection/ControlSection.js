import React, { memo } from "react";

import { Button, Flex, HStack, Icon, Menu, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AddMemberModal from "../../../shared/AddMemberModal/AddMemberModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";

const ControlSection = ({ taskStatus, taskId, refetchObservers }) => {
  const toast = useToast();
  const { isOpen: memberModalIsOpen, toggle: toggleMemberModal, close: closeMemberModal } = useDisclosure(false);

  /**
   * Handle assign observer to selected task
   * @param {*} userId - selected user id to add as observer
   */
  const addObserverToTask = async (userId) => {
    try {
      await axiosInstance.post("/pm/tasks/observer", {
        task_id: taskId,
        user_id: userId,
      });
      refetchObservers();
      toast.show({
        render: () => {
          return <SuccessToast message={`New observer added`} />;
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
    <HStack space={2}>
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

      <Button size="sm" variant="outline" onPress={toggleMemberModal}>
        <Flex flexDir="row" alignItems="center" gap={1}>
          <Icon as={<MaterialCommunityIcons name="eye" />} size={6} mr={1} />
          <Text>Add Observer</Text>
        </Flex>
      </Button>

      {memberModalIsOpen && (
        <AddMemberModal isOpen={memberModalIsOpen} onClose={closeMemberModal} onPressHandler={addObserverToTask} />
      )}
    </HStack>
  );
};

export default memo(ControlSection);
