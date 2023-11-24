import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import RenderHtml from "react-native-render-html";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Flex, FormControl, HStack, Skeleton, Text, VStack } from "native-base";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import ChecklistSection from "../../../components/Band/Task/TaskDetail/ChecklistSection/ChecklistSection";
import CostSection from "../../../components/Band/Task/TaskDetail/CostSection/CostSection";
import LabelSection from "../../../components/Band/Task/TaskDetail/LabelSection/LabelSection";
import PeopleSection from "../../../components/Band/Task/TaskDetail/PeopleSection/PeopleSection";
import DeadlineSection from "../../../components/Band/Task/TaskDetail/DeadlineSection/DeadlineSection";
import ControlSection from "../../../components/Band/Task/TaskDetail/ControlSection/ControlSection";
import AttachmentSection from "../../../components/Band/Task/TaskDetail/AttachmentSection/AttachmentSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import { useDisclosure } from "../../../hooks/useDisclosure";
import NewTaskSlider from "../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import PageHeader from "../../../components/shared/PageHeader";
import MenuSection from "../../../components/Band/Task/TaskDetail/MenuSection/MenuSection";
import { hyperlinkConverter } from "../../../helpers/hyperlinkConverter";

const TaskDetailScreen = ({ route }) => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const { taskId } = route.params;
  const loggedUser = userSelector.id;
  const [isReady, setIsReady] = useState(false);
  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);

  const { data: selectedTask, refetch: refetchSelectedTask } = useFetch(taskId && `/pm/tasks/${taskId}`);
  const { data: observers, refetch: refetchObservers } = useFetch(taskId && `/pm/tasks/${taskId}/observer`);
  const { data: responsible, refetch: refetchResponsible } = useFetch(taskId && `/pm/tasks/${taskId}/responsible`);

  const taskUserRights = [selectedTask?.data?.project_owner_id, selectedTask?.data?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const onOpenTaskForm = useCallback(() => {
    toggleTaskForm();
  }, []);

  const onCloseTaskForm = useCallback((resetForm) => {
    toggleTaskForm();
    resetForm();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 150);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isReady ? (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          extraHeight={200}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
        >
          <Flex
            bgColor="white"
            gap={5}
            style={{
              marginTop: 13,
              paddingHorizontal: 16,
            }}
          >
            <Flex gap={2}>
              <HStack justifyContent="space-between">
                <PageHeader
                  title={selectedTask?.data?.title}
                  subTitle={selectedTask?.data?.task_no}
                  onPress={() => navigation.goBack()}
                  width={width - 100}
                />

                {!inputIsDisabled && (
                  <MenuSection
                    selectedTask={selectedTask?.data}
                    disabled={inputIsDisabled}
                    openEditForm={onOpenTaskForm}
                    refetchResponsible={refetchResponsible}
                    responsible={responsible?.data}
                  />
                )}
              </HStack>

              <ControlSection
                taskStatus={selectedTask?.data?.status}
                selectedTask={selectedTask?.data}
                refetchTask={refetchSelectedTask}
              />
            </Flex>

            {/* Reponsible, Creator and Observer section */}
            <PeopleSection
              observers={observers?.data}
              responsibleArr={responsible?.data}
              ownerId={selectedTask?.data?.owner_id}
              ownerImage={selectedTask?.data?.owner_image}
              ownerName={selectedTask?.data?.owner_name}
              ownerEmail={selectedTask?.data?.owner_email}
              refetchObservers={refetchObservers}
              refetchTask={refetchSelectedTask}
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

              <RenderHtml
                contentWidth={width}
                source={{
                  html: hyperlinkConverter(selectedTask?.data?.description) || "",
                }}
              />
            </FormControl>

            {/* Checklists */}
            <ChecklistSection taskId={taskId} disabled={inputIsDisabled} />

            {/* Attachments */}
            <AttachmentSection taskId={taskId} disabled={inputIsDisabled} />

            {/* Comments */}
            <FormControl>
              <FormControl.Label>COMMENTS</FormControl.Label>
              <CommentInput taskId={taskId} data={selectedTask?.data} />
            </FormControl>
          </Flex>
        </KeyboardAwareScrollView>
      ) : (
        <VStack mt={2} px={4} space={2}>
          <Skeleton h={41} />
          <HStack space={2}>
            <Skeleton borderRadius="full" h={41} w={41} />
            <Skeleton w={200} />
          </HStack>
        </VStack>
      )}

      {/* Task Form */}
      {taskFormIsOpen && (
        <NewTaskSlider
          isOpen={taskFormIsOpen}
          taskData={selectedTask?.data}
          onClose={onCloseTaskForm}
          refetch={refetchSelectedTask}
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
