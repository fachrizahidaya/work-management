import React, { useState } from "react";

import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Icon, View, useSafeArea } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useDisclosure } from "../../hooks/useDisclosure";
import { useFetch } from "../../hooks/useFetch";
import TaskDetail from "../../components/Band/Task/TaskDetail/TaskDetail";
import CustomDrawer from "../../components/shared/CustomDrawer";
import NewTaskSlider from "../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import TaskList from "../../components/Band/Task/TaskList/TaskList";
import TaskFilter from "../../components/Band/shared/TaskFilter/TaskFilter";
import TaskViewSection from "../../components/Band/Project/ProjectTask/TaskViewSection";
import PageHeader from "../../components/shared/PageHeader";

const AdHocScreen = () => {
  const { height } = Dimensions.get("window");
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

  const {
    data: tasks,
    isLoading: taskIsLoading,
    isFetching: taskIsFetching,
    refetch: refetchTasks,
  } = useFetch(`/pm/tasks`, [selectedLabelId], fetchTaskParameters);
  const { data: labels } = useFetch(`/pm/labels`);

  // Get every task's responsible with no duplicates
  const responsibleArr = tasks?.data.map((val) => val.responsible_name);
  const noDuplicateResponsibleArr = [...new Set(responsibleArr)].filter((val) => {
    return val !== null;
  });

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
            <PageHeader title="Ad Hoc" backButton={false} />

            <TaskViewSection changeView={changeView} view={view} />

            <Flex flexDir="row" justifyContent="space-between" alignItems="center" mt={11} mb={21}>
              <TaskFilter
                data={tasks?.data}
                members={noDuplicateResponsibleArr}
                labels={labels}
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

export default AdHocScreen;

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
