import React from "react";

import { useSelector } from "react-redux";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Flex, FormControl, Text } from "native-base";
import { Platform, SafeAreaView, StyleSheet } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import ChecklistSection from "../../../components/Band/Task/TaskDetail/ChecklistSection/ChecklistSection";
import CostSection from "../../../components/Band/Task/TaskDetail/CostSection/CostSection";
import LabelSection from "../../../components/Band/Task/TaskDetail/LabelSection/LabelSection";
import TaskMenuSection from "../../../components/Band/Task/TaskDetail/TaskMenuSection/TaskMenuSection";
import PeopleSection from "../../../components/Band/Task/TaskDetail/PeopleSection/PeopleSection";
import DeadlineSection from "../../../components/Band/Task/TaskDetail/DeadlineSection/DeadlineSection";
import ControlSection from "../../../components/Band/Task/TaskDetail/ControlSection/ControlSection";
import AttachmentSection from "../../../components/Band/Task/TaskDetail/AttachmentSection/AttachmentSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import { useDisclosure } from "../../../hooks/useDisclosure";
import NewTaskSlider from "../../../components/Band/Task/NewTaskSlider/NewTaskSlider";

const TaskDetailScreen = ({ route }) => {
  const userSelector = useSelector((state) => state.auth);
  const { taskId } = route.params;
  const loggedUser = userSelector.id;
  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);

  const { data: selectedTask, refetch: refetchSelectedTask } = useFetch(taskId && `/pm/tasks/${taskId}`);
  const { data: observers, refetch: refetchObservers } = useFetch(taskId && `/pm/tasks/${taskId}/observer`);
  const { data: responsible, refetch: refetchResponsible } = useFetch(taskId && `/pm/tasks/${taskId}/responsible`);

  const taskUserRights = [
    selectedTask?.data?.project_owner_id,
    selectedTask?.data?.owner_id,
    selectedTask?.data?.responsible_id,
  ];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const onOpenTaskForm = () => {
    toggleTaskForm();
  };

  const onCloseTaskForm = (resetForm) => {
    toggleTaskForm();
    resetForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={200}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        {/* <ScrollView> */}
        <Flex bgColor="white" p={5} gap={5}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <TaskMenuSection />

            <ControlSection
              taskStatus={selectedTask?.data?.status}
              selectedTask={selectedTask?.data}
              refetchResponsible={refetchResponsible}
              responsible={responsible?.data}
              openEditForm={onOpenTaskForm}
              refetchTask={refetchSelectedTask}
            />
          </Flex>
          <Text fontSize={20}>{selectedTask?.data?.title}</Text>

          {/* Reponsible, Creator and Observer section */}
          <PeopleSection
            observers={observers?.data}
            responsibleArr={responsible?.data}
            ownerId={selectedTask?.data?.owner_id}
            ownerImage={selectedTask?.data?.owner_image}
            ownerName={selectedTask?.data?.owner_name}
            refetchObservers={refetchObservers}
            disabled={inputIsDisabled}
            selectedTask={selectedTask?.data}
            refetchResponsible={refetchResponsible}
          />

          {/* Labels */}
          <LabelSection projectId={selectedTask?.data?.project_id} taskId={taskId} disabled={inputIsDisabled} />

          {/* Due date and cost */}
          <Flex flexDir="column" justifyContent="space-between" gap={5}>
            <DeadlineSection
              deadline={selectedTask?.data?.deadline}
              projectDeadline={selectedTask?.data?.project_deadline}
              disabled={inputIsDisabled}
              taskId={taskId}
            />

            <CostSection taskId={taskId} disabled={inputIsDisabled} />
          </Flex>

          {/* Description */}
          <FormControl>
            <FormControl.Label>DESCRIPTION</FormControl.Label>
            <Text>{selectedTask?.data?.description}</Text>
          </FormControl>

          {/* Checklists */}
          <ChecklistSection taskId={taskId} />

          {/* Attachments */}
          <AttachmentSection taskId={taskId} />

          {/* Comments */}
          <FormControl>
            <FormControl.Label>COMMENTS</FormControl.Label>
            <CommentInput taskId={taskId} />
          </FormControl>
        </Flex>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>

      {taskFormIsOpen && (
        <NewTaskSlider
          isOpen={taskFormIsOpen}
          taskData={selectedTask?.data}
          onClose={onCloseTaskForm}
          refetchCurrentTask={refetchSelectedTask}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default TaskDetailScreen;
