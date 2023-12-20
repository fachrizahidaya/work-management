import React, { memo } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { FlatList, View, Text } from "react-native";

import CustomAccordion from "../../../shared/CustomAccordion";
import TaskListItem from "./TaskListItem/TaskListItem";
import TaskSkeleton from "./TaskSkeleton";
import useCheckAccess from "../../../../hooks/useCheckAccess";
import Button from "../../../shared/Forms/Button";
import { FlashList } from "@shopify/flash-list";

const TaskList = ({ tasks, isLoading, openNewTaskForm, openCloseTaskConfirmation }) => {
  const createActionCheck = useCheckAccess("create", "Tasks");

  const todoTasks = tasks?.filter((task) => {
    return task.status === "Open";
  });
  const onProgressTasks = tasks?.filter((task) => {
    return task.status === "On Progress";
  });

  const finishTasks = tasks?.filter((task) => {
    return task.status === "Finish" || task.status === "Closed";
  });

  return (
    <View style={{ display: "flex", gap: 20 }}>
      <CustomAccordion title="ToDo" subTitle={todoTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlashList
                  estimatedItemSize={112}
                  data={todoTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  renderItem={({ item }) => (
                    <TaskListItem
                      id={item.id}
                      no={item.task_no}
                      task={item}
                      title={item.title}
                      image={item.responsible_image}
                      deadline={item.deadline}
                      priority={item.priority}
                      totalAttachments={item.total_attachment}
                      totalChecklists={item.total_checklist}
                      totalChecklistsDone={item.total_checklist_finish}
                      totalComments={item.total_comment}
                      status={item.status}
                      responsible={item.responsible_name}
                      responsibleId={item.responsible_id}
                      openCloseTaskConfirmation={openCloseTaskConfirmation}
                    />
                  )}
                />
              </View>
            </ScrollView>

            {createActionCheck && (
              <Button
                onPress={() => openNewTaskForm("Open")}
                backgroundColor="white"
                fontColor="#176688"
                variant="dashed"
              >
                <Text style={{ color: "#176688", fontWeight: 500 }}>ADD TASK</Text>
              </Button>
            )}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </CustomAccordion>

      <CustomAccordion title="In Progress" subTitle={onProgressTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlashList
                  estimatedItemSize={112}
                  data={onProgressTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  renderItem={({ item }) => (
                    <TaskListItem
                      id={item.id}
                      no={item.task_no}
                      task={item}
                      title={item.title}
                      image={item.responsible_image}
                      deadline={item.deadline}
                      priority={item.priority}
                      totalAttachments={item.total_attachment}
                      totalChecklists={item.total_checklist}
                      totalChecklistsDone={item.total_checklist_finish}
                      totalComments={item.total_comment}
                      status={item.status}
                      responsible={item.responsible_name}
                      responsibleId={item.responsible_id}
                      openCloseTaskConfirmation={openCloseTaskConfirmation}
                    />
                  )}
                />
              </View>
            </ScrollView>

            {createActionCheck && (
              <Button
                onPress={() => openNewTaskForm("On Progress")}
                backgroundColor="white"
                fontColor="#176688"
                variant="dashed"
              >
                <Text style={{ color: "#176688", fontWeight: 500 }}>ADD TASK</Text>
              </Button>
            )}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </CustomAccordion>

      <CustomAccordion title="Completed" subTitle={finishTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlashList
                  estimatedItemSize={112}
                  estima
                  data={finishTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  renderItem={({ item }) => (
                    <TaskListItem
                      id={item.id}
                      no={item.task_no}
                      task={item}
                      title={item.title}
                      image={item.responsible_image}
                      deadline={item.deadline}
                      priority={item.priority}
                      totalAttachments={item.total_attachment}
                      totalChecklists={item.total_checklist}
                      totalChecklistsDone={item.total_checklist_finish}
                      totalComments={item.total_comment}
                      status={item.status}
                      responsible={item.responsible_name}
                      responsibleId={item.responsible_id}
                      openCloseTaskConfirmation={openCloseTaskConfirmation}
                    />
                  )}
                />
              </View>
            </ScrollView>

            {createActionCheck && (
              <Button
                onPress={() => openNewTaskForm("Finish")}
                backgroundColor="white"
                fontColor="#176688"
                variant="dashed"
              >
                <Text style={{ color: "#176688", fontWeight: 500 }}>ADD TASK</Text>
              </Button>
            )}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </CustomAccordion>
    </View>
  );
};

export default memo(TaskList);
