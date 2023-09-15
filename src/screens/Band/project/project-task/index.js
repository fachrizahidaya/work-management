import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Pressable, Skeleton, Text, useSafeArea } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import NewTaskSlider from "../../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import CustomDrawer from "../../../../components/shared/CustomDrawer";
import TaskDetail from "../../../../components/Band/Task/TaskDetail/TaskDetail";

const ProjectTaskScreen = ({ route }) => {
  const { height } = Dimensions.get("window");
  const { projectId } = route.params;
  const navigation = useNavigation();
  const [view, setView] = useState("Task List");
  const [taskFormIsOpen, setTaskFormIsOpen] = useState(false);
  const [taskDetailIsOpen, setTaskDetailIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Open");

  const onPressTaskItem = (task) => {
    setTaskDetailIsOpen(!taskDetailIsOpen);
    setSelectedTask(task);
  };

  const onCloseTaskDetail = () => {
    setTaskDetailIsOpen(!taskDetailIsOpen);
    setSelectedTask(null);
  };

  const onOpenTaskForm = (task) => {
    setTaskFormIsOpen(true);
    setTaskToEdit(task);
  };

  const onCloseTaskForm = (resetForm) => {
    setTaskFormIsOpen(false);
    setTaskToEdit(null);
    setSelectedStatus("Open");
    resetForm();
  };

  const onOpenTaskFormWithStatus = (status) => {
    setTaskFormIsOpen(true);
    setSelectedStatus(status);
  };

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
  });

  const changeView = (value) => {
    setView(value);
  };

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const { data: tasks, isLoading: taskIsLoading, refetch: refetchTasks } = useFetch(`/pm/tasks/project/${projectId}`);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 16, marginVertical: 13 }}>
        <Flex gap={15}>
          <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
            <Pressable onPress={() => navigation.navigate("Project Detail", { projectId: projectId })}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
            </Pressable>

            {!isLoading ? <Text fontSize={16}>{data?.data.title}</Text> : <Skeleton h={8} w={200} />}
          </Flex>

          <Flex flexDir="row" style={{ gap: 8 }}>
            <Button
              flex={1}
              variant="outline"
              borderColor={view === "Task List" ? "primary.600" : "#E8E9EB"}
              onPress={() => changeView("Task List")}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon
                  as={<MaterialCommunityIcons name="format-list-bulleted" />}
                  color={view === "Task List" ? "primary.600" : "#3F434A"}
                  size="md"
                />
                <Text color={view === "Task List" ? "primary.600" : "#3F434A"}>Task List</Text>
              </Flex>
            </Button>
            <Button
              flex={1}
              variant="outline"
              borderColor={view === "Kanban" ? "primary.600" : "#E8E9EB"}
              onPress={() => changeView("Kanban")}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon
                  as={<MaterialCommunityIcons name="map-outline" />}
                  color={view === "Kanban" ? "primary.600" : "#3F434A"}
                  size="md"
                />
                <Text color={view === "Kanban" ? "primary.600" : "#3F434A"}>Kanban</Text>
              </Flex>
            </Button>
            <Button
              flex={1}
              variant="outline"
              borderColor={view === "Gantt Chart" ? "primary.600" : "#E8E9EB"}
              onPress={() => changeView("Gantt Chart")}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon
                  as={<MaterialCommunityIcons name="chart-gantt" />}
                  color={view === "Gantt Chart" ? "primary.600" : "#3F434A"}
                  size="md"
                />
                <Text color={view === "Gantt Chart" ? "primary.600" : "#3F434A"}>Gantt Chart</Text>
              </Flex>
            </Button>
          </Flex>

          <Flex flexDir="row" justifyContent="space-between" alignItems="center" mt={11} mb={21}>
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="tune-variant" />} color="#3F434A" />
            </Pressable>

            <Button onPress={() => setTaskFormIsOpen(true)}>
              <Flex flexDir="row" gap={6} alignItems="center" px={2}>
                <Text color="white">Add</Text>

                <Box alignItems="center" bgColor="#2d6076" borderRadius={10} p={2}>
                  <Icon as={<MaterialCommunityIcons name="plus" />} color="white" />
                </Box>
              </Flex>
            </Button>
          </Flex>
        </Flex>

        {/* Task List view */}
        {view === "Task List" && (
          <TaskList
            tasks={tasks?.data}
            isLoading={taskIsLoading}
            openDetail={onPressTaskItem}
            openEditForm={onOpenTaskForm}
            openNewTaskForm={onOpenTaskFormWithStatus}
          />
        )}
      </ScrollView>

      {taskFormIsOpen && (
        <NewTaskSlider
          isOpen={taskFormIsOpen}
          projectId={projectId}
          taskData={taskToEdit}
          selectedStatus={selectedStatus}
          onClose={onCloseTaskForm}
          setSelectedTask={setSelectedTask}
        />
      )}

      <CustomDrawer isOpen={taskDetailIsOpen} height={height}>
        <TaskDetail
          safeAreaProps={safeAreaProps}
          onCloseDetail={onCloseTaskDetail}
          selectedTask={selectedTask}
          openEditForm={onOpenTaskForm}
          refetch={refetchTasks}
        />
      </CustomDrawer>
    </SafeAreaView>
  );
};

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
