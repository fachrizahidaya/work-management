import React, { memo } from "react";

import { useSelector } from "react-redux";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Flex, FormControl, Text } from "native-base";
import { Platform, SafeAreaView, StyleSheet } from "react-native";

import { useFetch } from "../../../../hooks/useFetch";
import AttachmentSection from "./AttachmentSection/AttachmentSection";
import ChecklistSection from "./ChecklistSection/ChecklistSection";
import CostSection from "./CostSection/CostSection";
import LabelSection from "./LabelSection/LabelSection";
import CommentInput from "../../shared/CommentInput/CommentInput";
import TaskMenuSection from "./TaskMenuSection/TaskMenuSection";
import PeopleSection from "./PeopleSection/PeopleSection";
import DeadlineSection from "./DeadlineSection/DeadlineSection";
import ControlSection from "./ControlSection/ControlSection";

const TaskDetail = ({ safeAreaProps, onCloseDetail, selectedTask, openEditForm, refetch }) => {
  const userSelector = useSelector((state) => state.auth);
  const loggedUser = userSelector.id;
  const taskUserRights = [selectedTask?.project_owner_id, selectedTask?.owner_id, selectedTask?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const { data: observers, refetch: refetchObservers } = useFetch(
    selectedTask?.id && `/pm/tasks/${selectedTask?.id}/observer`
  );

  const { data: responsible, refetch: refetchResponsible } = useFetch(
    selectedTask?.id && `/pm/tasks/${selectedTask?.id}/responsible`
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={200}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        {/* <ScrollView> */}
        <Flex {...safeAreaProps} bgColor="white" p={5} gap={5}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <TaskMenuSection onCloseDetail={onCloseDetail} />

            <ControlSection
              taskStatus={selectedTask?.status}
              selectedTask={selectedTask}
              refetchResponsible={refetchResponsible}
              refetchAllTasks={refetch}
              openEditForm={openEditForm}
            />
          </Flex>
          <Text fontSize={20}>{selectedTask?.title}</Text>

          {/* Reponsible, Creator and Observer section */}
          <PeopleSection
            observers={observers?.data}
            responsibleArr={responsible?.data}
            ownerId={selectedTask?.owner_id}
            ownerImage={selectedTask?.owner_image}
            ownerName={selectedTask?.owner_name}
            refetchObservers={refetchObservers}
            disabled={inputIsDisabled}
            selectedTask={selectedTask}
            refetchAllTasks={refetch}
            refetchResponsible={refetchResponsible}
          />

          {/* Labels */}
          <LabelSection projectId={selectedTask?.project_id} taskId={selectedTask?.id} disabled={inputIsDisabled} />

          {/* Due date and cost */}
          <Flex flexDir="column" justifyContent="space-between" gap={5}>
            <DeadlineSection
              deadline={selectedTask?.deadline}
              projectDeadline={selectedTask?.project_deadline}
              disabled={inputIsDisabled}
              taskId={selectedTask?.id}
              refetchTasks={refetch}
            />

            <CostSection taskId={selectedTask?.id} disabled={inputIsDisabled} />
          </Flex>

          {/* Description */}
          <FormControl>
            <FormControl.Label>DESCRIPTION</FormControl.Label>
            <Text>{selectedTask?.description}</Text>
          </FormControl>

          {/* Checklists */}
          <ChecklistSection taskId={selectedTask?.id} />

          {/* Attachments */}
          <AttachmentSection taskId={selectedTask?.id} />

          {/* Comments */}
          <FormControl>
            <FormControl.Label>COMMENTS</FormControl.Label>
            <CommentInput taskId={selectedTask?.id} />
          </FormControl>
        </Flex>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default memo(TaskDetail);
