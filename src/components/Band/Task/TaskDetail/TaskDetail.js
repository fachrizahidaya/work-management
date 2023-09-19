import React, { memo } from "react";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { Flex, FormControl, KeyboardAvoidingView, Text } from "native-base";

import { useFetch } from "../../../../hooks/useFetch";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";
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
  const { width } = Dimensions.get("window");
  const { isKeyboardVisible } = useKeyboardChecker();
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
    <KeyboardAvoidingView behavior="height" flex={1} width={width} pb={isKeyboardVisible ? 100 : 21}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Flex {...safeAreaProps} bgColor="white" p={5} gap={5}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <ControlSection
              taskStatus={selectedTask?.status}
              taskId={selectedTask?.id}
              refetchObservers={refetchObservers}
            />

            <TaskMenuSection
              selectedTask={selectedTask}
              onCloseDetail={onCloseDetail}
              openEditForm={openEditForm}
              refetchAllTasks={refetch}
              responsible={responsible?.data[0]}
              refetchResponsible={refetchResponsible}
            />
          </Flex>
          <Text fontSize={20}>{selectedTask?.title}</Text>

          {/* Reponsible, Creator and Observer section */}
          <PeopleSection
            observers={observers}
            responsibleArr={responsible?.data}
            ownerId={selectedTask?.owner_id}
            ownerImage={selectedTask?.owner_image}
            ownerName={selectedTask?.owner_name}
            refetchObservers={refetchObservers}
            disabled={inputIsDisabled}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(TaskDetail);
