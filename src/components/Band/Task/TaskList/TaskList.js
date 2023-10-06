import React from "react";

import { Box, Button, Flex, Icon, Skeleton, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomAccordion from "../../../shared/CustomAccordion";
import TaskListItem from "./TaskListItem";

const TaskList = ({ tasks, isLoading, openDetail, openNewTaskForm, openCloseTaskConfirmation }) => {
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
    <Flex gap={8}>
      <CustomAccordion title="ToDo" subTitle={todoTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={todoTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <TaskListItem
                      key={item.id}
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
                      onPress={openDetail}
                      openCloseTaskConfirmation={openCloseTaskConfirmation}
                    />
                  )}
                />
              </Box>
            </ScrollView>
            <Button
              variant="outline"
              borderStyle="dashed"
              style={{ height: 56 }}
              onPress={() => openNewTaskForm("Open")}
            >
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                <Text color="primary.600">ADD TASK</Text>
              </Flex>
            </Button>
          </>
        ) : (
          <Skeleton h={40} />
        )}
      </CustomAccordion>

      <CustomAccordion title="In Progress" subTitle={onProgressTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={onProgressTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <TaskListItem
                      key={item.id}
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
                      onPress={openDetail}
                    />
                  )}
                />
              </Box>
            </ScrollView>

            <Button
              variant="outline"
              borderStyle="dashed"
              style={{ height: 56 }}
              onPress={() => openNewTaskForm("On Progress")}
            >
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                <Text color="primary.600">ADD TASK</Text>
              </Flex>
            </Button>
          </>
        ) : (
          <Skeleton h={40} />
        )}
      </CustomAccordion>

      <CustomAccordion title="Completed" subTitle={finishTasks?.length || 0}>
        {!isLoading ? (
          <>
            <ScrollView style={{ maxHeight: 300 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={finishTasks}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <TaskListItem
                      key={item.id}
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
                      onPress={openDetail}
                    />
                  )}
                />
              </Box>
            </ScrollView>

            <Button
              variant="outline"
              borderStyle="dashed"
              style={{ height: 56 }}
              onPress={() => openNewTaskForm("Finish")}
            >
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="plus" />} color="primary.600" />
                <Text color="primary.600">ADD TASK</Text>
              </Flex>
            </Button>
          </>
        ) : (
          <Skeleton h={40} />
        )}
      </CustomAccordion>
    </Flex>
  );
};

export default TaskList;
