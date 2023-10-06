import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Center, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useDisclosure } from "../../hooks/useDisclosure";
import { useFetch } from "../../hooks/useFetch";
import NewTaskSlider from "../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import TaskList from "../../components/Band/Task/TaskList/TaskList";
import TaskFilter from "../../components/Band/shared/TaskFilter/TaskFilter";
import TaskViewSection from "../../components/Band/Project/ProjectTask/TaskViewSection";
import PageHeader from "../../components/shared/PageHeader";

const AdHocScreen = () => {
  const navigation = useNavigation();
  const [view, setView] = useState("Task List");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const fetchTaskParameters = {
    label_id: selectedLabelId,
  };

  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);

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
    navigation.navigate("Task Detail", { taskId: task.id });
  };

  const onOpenTaskFormWithStatus = (status) => {
    toggleTaskForm();
    setSelectedStatus(status);
  };

  const onCloseTaskForm = (resetForm) => {
    toggleTaskForm();
    setSelectedStatus("Open");
    resetForm();
  };

  const changeView = (value) => {
    setView(value);
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex gap={15} style={{ marginTop: 13 }}>
          <PageHeader title="Ad Hoc" backButton={false} />

          <TaskViewSection changeView={changeView} view={view} />

          <Flex flexDir="row" mt={11} mb={21}>
            <TaskFilter
              data={tasks?.data}
              members={noDuplicateResponsibleArr}
              labels={labels}
              setSelectedLabelId={setSelectedLabelId}
              setFilteredData={setFilteredData}
            />
          </Flex>
        </Flex>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={taskIsFetching} onRefresh={refetchTasks} />}
          style={{ marginBottom: 10 }}
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

          {view === "Kanban" && (
            <Center>
              <Text bold>This feature only available for desktop</Text>
            </Center>
          )}
          {view === "Gantt Chart" && (
            <Center>
              <Text bold>This feature only available for desktop</Text>
            </Center>
          )}
        </ScrollView>

        {taskFormIsOpen && (
          <NewTaskSlider
            selectedStatus={selectedStatus}
            onClose={onCloseTaskForm}
            isOpen={taskFormIsOpen}
            refetch={refetchTasks}
          />
        )}

        <Pressable
          position="absolute"
          right={5}
          bottom={5}
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

export default AdHocScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    position: "relative",
  },
});
