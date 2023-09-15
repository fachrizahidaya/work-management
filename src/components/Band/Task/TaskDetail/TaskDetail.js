import React, { memo } from "react";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import {
  Button,
  Flex,
  FormControl,
  HStack,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Menu,
  Text,
  useToast,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import { useFetch } from "../../../../hooks/useFetch";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";
import AttachmentSection from "./AttachmentSection/AttachmentSection";
import ChecklistSection from "./ChecklistSection/ChecklistSection";
import CostSection from "./CostSection/CostSection";
import LabelSection from "./LabelSection/LabelSection";
import CommentInput from "../../shared/CommentInput/CommentInput";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import AddMemberModal from "../../shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import TaskMenuSection from "./TaskMenuSection/TaskMenuSection";

const TaskDetail = ({ safeAreaProps, onCloseDetail, selectedTask, openEditForm, refetch }) => {
  const { width } = Dimensions.get("window");
  const toast = useToast();
  const { isKeyboardVisible } = useKeyboardChecker();
  const userSelector = useSelector((state) => state.auth);
  const loggedUser = userSelector.id;
  const taskUserRights = [selectedTask?.project_owner_id, selectedTask?.owner_id, selectedTask?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);
  const { isOpen: memberModalIsOpen, toggle: toggleMemberModal, close: closeMemberModal } = useDisclosure(false);

  const { data: observers, refetch: refetchObservers } = useFetch(
    selectedTask?.id && `/pm/tasks/${selectedTask?.id}/observer`
  );

  const { data: responsible, refetch: refetchResponsible } = useFetch(
    selectedTask?.id && `/pm/tasks/${selectedTask?.id}/responsible`
  );

  /**
   * Handle assign observer to selected task
   * @param {*} userId - selected user id to add as observer
   */
  const addObserverToTask = async (userId) => {
    try {
      await axiosInstance.post("/pm/tasks/observer", {
        task_id: selectedTask.id,
        user_id: userId,
      });
      refetchObservers();
      toast.show({
        render: () => {
          return <SuccessToast message={`New member added`} />;
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
    <KeyboardAvoidingView behavior="height" flex={1} width={width} pb={isKeyboardVisible ? 100 : 21}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Flex {...safeAreaProps} bgColor="white" p={5} gap={5}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <HStack space={2}>
              <Menu
                w="160"
                trigger={(triggerProps) => {
                  return (
                    <Button size="md" {...triggerProps}>
                      <Flex flexDir="row" alignItems="center" gap={1}>
                        <Text color="white">{selectedTask?.status}</Text>
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
                <AddMemberModal
                  isOpen={memberModalIsOpen}
                  onClose={closeMemberModal}
                  onPressHandler={addObserverToTask}
                />
              )}
            </HStack>

            <TaskMenuSection
              selectedTask={selectedTask}
              onCloseDetail={onCloseDetail}
              openEditForm={openEditForm}
              refetchAllTasks={refetch}
              responsible={responsible}
              refetchResponsible={refetchResponsible}
            />
          </Flex>
          <Text fontSize={20}>{selectedTask?.title}</Text>

          {/* Responsible and creator */}
          <Flex flexDir="row">
            <FormControl flex={1}>
              <FormControl.Label>ASSIGNED TO</FormControl.Label>
              {responsible?.data?.length > 0 ? (
                <AvatarPlaceholder
                  name={responsible?.data[0]?.responsible_name}
                  image={responsible?.data[0]?.responsible_image}
                  size="sm"
                />
              ) : (
                <Text>Not assigned</Text>
              )}
            </FormControl>

            <FormControl flex={1}>
              <FormControl.Label>CREATED BY</FormControl.Label>
              {selectedTask?.owner_id && (
                <AvatarPlaceholder name={selectedTask?.owner_name} image={selectedTask?.owner_image} size="sm" />
              )}
            </FormControl>
          </Flex>

          {/* Observers */}
          <FormControl>
            <FormControl.Label>OBSERVER</FormControl.Label>
            <Flex flexDir="row" gap={1}>
              {observers?.data.length > 0 &&
                observers.data.map((observer) => {
                  return (
                    <AvatarPlaceholder
                      key={observer.id}
                      image={observer.observer_image}
                      name={observer.observer_name}
                      size="sm"
                    />
                  );
                })}
            </Flex>
          </FormControl>

          {/* Labels */}
          <LabelSection />

          {/* Due date and cost */}
          <Flex flexDir="column" justifyContent="space-between" gap={5}>
            <FormControl>
              <FormControl.Label>DUE DATE</FormControl.Label>
              <CustomDateTimePicker defaultValue={selectedTask?.deadline} disabled={inputIsDisabled} />
            </FormControl>

            <CostSection />
          </Flex>

          {/* Description */}
          <FormControl>
            <FormControl.Label>DESCRIPTION</FormControl.Label>
            <Text>{selectedTask?.description}</Text>
          </FormControl>

          {/* Checklists */}
          <ChecklistSection
            checklistFinishPercent={selectedTask?.checklist_finish_percent}
            totalChecklist={selectedTask?.total_checklist}
            totalChecklistFinish={selectedTask?.total_checklist_finish}
          />

          {/* Attachments */}
          <AttachmentSection taskId={selectedTask?.id} />

          {/* Comments */}
          <FormControl>
            <FormControl.Label>COMMENTS</FormControl.Label>
            <CommentInput taskId={selectedTask?.id} />
          </FormControl>
        </Flex>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(TaskDetail);
