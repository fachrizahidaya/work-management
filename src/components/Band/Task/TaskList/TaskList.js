import React, { memo } from "react";

import { Flex } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { FlatList, View, Button, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomAccordion from "../../../shared/CustomAccordion";
import TaskListItem from "./TaskListItem/TaskListItem";
import TaskSkeleton from "./TaskSkeleton";
import useCheckAccess from "../../../../hooks/useCheckAccess";

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
    <View style={{ display: "flex", gap: 8 }}>
      <CustomAccordion title="ToDo" subTitle={todoTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlatList
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
                variant="outline"
                borderStyle="dashed"
                style={{ height: 56 }}
                onPress={() => openNewTaskForm("Open")}
                title="ADD TASK"
              >
                {/* <View style={{display: }} flexDir="row" alignItems="center" gap={1}>
                  <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                  <Text color="primary.600">ADD TASK</Text>
                </View style={{display: }}> */}
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
                <FlatList
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
                variant="outline"
                borderStyle="dashed"
                style={{ height: 56 }}
                onPress={() => openNewTaskForm("On Progress")}
                title="ADD TASK"
              >
                {/* <View style={{display: }} flexDir="row" alignItems="center" gap={1}>
                  <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                  <Text color="primary.600">ADD TASK</Text>
                </View style={{display: }}> */}
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
                <FlatList
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
                variant="outline"
                borderStyle="dashed"
                style={{ height: 56 }}
                onPress={() => openNewTaskForm("Finish")}
                title="ADD TASK"
              >
                {/* <View style={{display: }} flexDir="row" alignItems="center" gap={1}>
                  <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                  <Text color="primary.600">ADD TASK</Text>
                </View style={{display: }}> */}
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
