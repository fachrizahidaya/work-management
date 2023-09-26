import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Pressable, Skeleton, Text, View, useSafeArea } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import NewTaskSlider from "../../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import CustomDrawer from "../../../../components/shared/CustomDrawer";
import TaskDetail from "../../../../components/Band/Task/TaskDetail/TaskDetail";
import TaskViewSection from "../../../../components/Band/Project/ProjectTask/TaskViewSection";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import TaskFilter from "../../../../components/Band/shared/TaskFilter/TaskFilter";

const ProjectTaskScreen = ({ route }) => {
  const { height } = Dimensions.get("window");
  const { projectId } = route.params;
  const navigation = useNavigation();
  const [view, setView] = useState("Task List");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTaskParameters = {
    label_id: selectedLabelId,
  };

  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);
  const { isOpen: taskDetailIsOpen, toggle: toggleTaskDetail } = useDisclosure(false);

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const {
    data: tasks,
    isLoading: taskIsLoading,
    isFetching: taskIsFetching,
    refetch: refetchTasks,
  } = useFetch(`/pm/tasks/project/${projectId}`, [selectedLabelId], fetchTaskParameters);

  const onPressTaskItem = (task) => {
    toggleTaskDetail();
    setSelectedTask(task);
  };

  const onCloseTaskDetail = () => {
    toggleTaskDetail();
    setSelectedTask(null);
  };

  const onOpenTaskForm = (task) => {
    toggleTaskForm();
    setTaskToEdit(task);
    if (selectedTask) {
      toggleTaskDetail();
    }
  };

  const onCloseTaskForm = (resetForm) => {
    toggleTaskForm();
    setTaskToEdit(null);
    setSelectedStatus("Open");
    resetForm();
    if (selectedTask) {
      toggleTaskDetail();
    }
  };

  const onOpenTaskFormWithStatus = (status) => {
    toggleTaskForm();
    setSelectedStatus(status);
  };

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
  });

  const changeView = (value) => {
    setView(value);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginVertical: 13 }}
          refreshControl={<RefreshControl refreshing={taskIsFetching} onRefresh={refetchTasks} />}
        >
          <Flex gap={15}>
            <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
              <Pressable onPress={() => navigation.navigate("Project Detail", { projectId: projectId })}>
                <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
              </Pressable>

              {!isLoading ? <Text fontSize={16}>{data?.data.title}</Text> : <Skeleton h={8} w={200} />}
            </Flex>

            <TaskViewSection changeView={changeView} view={view} />

            <Flex flexDir="row" justifyContent="space-between" alignItems="center" mt={11} mb={21}>
              <TaskFilter
                data={tasks?.data}
                fetchMemberUrl={`/pm/projects/${projectId}/member`}
                fetchLabelUrl={`/pm/projects/${projectId}/label`}
                setSelectedLabelId={setSelectedLabelId}
                setFilteredData={setFilteredData}
              />

              <Button
                size="lg"
                onPress={toggleTaskForm}
                endIcon={<Icon as={<MaterialCommunityIcons name="plus" />} color="white" />}
              >
                Task
              </Button>
            </Flex>
          </Flex>

          {/* Task List view */}
          {view === "Task List" && (
            <TaskList
              tasks={filteredData}
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
      </SafeAreaView>

      {/* Task Detail */}
      {Platform.OS === "ios" ? (
        <CustomDrawer isOpen={taskDetailIsOpen} height={height} isReady={selectedTask?.id}>
          <TaskDetail
            safeAreaProps={safeAreaProps}
            onCloseDetail={onCloseTaskDetail}
            selectedTask={selectedTask}
            openEditForm={onOpenTaskForm}
            refetch={refetchTasks}
          />
        </CustomDrawer>
      ) : (
        <>
          {selectedTask && (
            <View style={styles.taskDetailAndroid}>
              <TaskDetail
                safeAreaProps={safeAreaProps}
                onCloseDetail={onCloseTaskDetail}
                selectedTask={selectedTask}
                openEditForm={onOpenTaskForm}
                refetch={refetchTasks}
              />
            </View>
          )}
        </>
      )}
    </>
  );
};

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  taskDetailAndroid: {
    flex: 1,
    backgroundColor: "white",
    position: "absolute",
    top: Platform.OS === "android" ? -20 : -40,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
