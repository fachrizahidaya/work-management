import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Platform, SafeAreaView, StyleSheet } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Flex, Icon, Pressable } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import NewTaskSlider from "../../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import TaskViewSection from "../../../../components/Band/Project/ProjectTask/TaskViewSection";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import TaskFilter from "../../../../components/Band/shared/TaskFilter/TaskFilter";
import PageHeader from "../../../../components/shared/PageHeader";

const ProjectTaskScreen = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();
  const [view, setView] = useState("Task List");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTaskParameters = {
    label_id: selectedLabelId,
  };

  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const {
    data: tasks,
    isLoading: taskIsLoading,
    isFetching: taskIsFetching,
    refetch: refetchTasks,
  } = useFetch(`/pm/tasks/project/${projectId}`, [selectedLabelId], fetchTaskParameters);
  const { data: members } = useFetch(`/pm/projects/${projectId}/member`);
  const { data: labels } = useFetch(`/pm/projects/${projectId}/label`);

  const onPressTaskItem = (task) => {
    navigation.navigate("Task Detail", { taskId: task.id });
  };

  const onOpenTaskFormWithStatus = (status) => {
    toggleTaskForm();
    setSelectedStatus(status);
  };

  const onCloseTaskForm = (resetForm) => {
    toggleTaskForm();
    resetForm();
    setSelectedStatus("Open");
  };

  const changeView = (value) => {
    setView(value);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex gap={15} style={{ marginTop: 13, paddingHorizontal: 16 }}>
          <PageHeader
            title={data?.data.title}
            withLoading
            isLoading={isLoading}
            onPress={() => navigation.navigate("Project Detail", { projectId: projectId })}
          />

          <TaskViewSection changeView={changeView} view={view} />

          <Flex flexDir="row" mt={11} mb={21}>
            <TaskFilter
              data={tasks?.data}
              members={members?.data}
              labels={labels}
              setSelectedLabelId={setSelectedLabelId}
              setFilteredData={setFilteredData}
            />
          </Flex>
        </Flex>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={taskIsFetching} onRefresh={refetchTasks} />}
          style={{ paddingHorizontal: 16, marginBottom: 10 }}
        >
          {/* Task List view */}
          {view === "Task List" && (
            <TaskList
              tasks={filteredData}
              isLoading={taskIsLoading}
              openDetail={onPressTaskItem}
              openNewTaskForm={onOpenTaskFormWithStatus}
            />
          )}
        </ScrollView>

        {/* Task Form */}
        {taskFormIsOpen && (
          <NewTaskSlider
            selectedStatus={selectedStatus}
            onClose={onCloseTaskForm}
            projectId={projectId}
            refetch={refetchTasks}
          />
        )}

        <Pressable
          position="absolute"
          right={5}
          bottom={81}
          rounded="full"
          bgColor="primary.600"
          p={15}
          onPress={toggleTaskForm}
        >
          <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
        </Pressable>
      </SafeAreaView>
    </>
  );
};

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
});
