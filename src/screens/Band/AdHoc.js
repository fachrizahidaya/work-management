import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

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
import ConfirmationModal from "../../components/shared/ConfirmationModal";

const AdHocScreen = () => {
  const firstTimeRef = useRef(true);
  const [view, setView] = useState("Task List");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen: closeConfirmationIsOpen, toggle: toggleCloseConfirmation } = useDisclosure(false);

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

  const onOpenTaskFormWithStatus = useCallback((status) => {
    toggleTaskForm();
    setSelectedStatus(status);
  }, []);

  const onCloseTaskForm = useCallback((resetForm) => {
    toggleTaskForm();
    setSelectedStatus("Open");
    resetForm();
  }, []);

  const changeView = useCallback((value) => {
    setView(value);
  }, []);

  const onOpenCloseConfirmation = useCallback((task) => {
    toggleCloseConfirmation();
    setSelectedTask(task);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetchTasks();
    }, [refetchTasks])
  );
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
              openNewTaskForm={onOpenTaskFormWithStatus}
              openCloseTaskConfirmation={onOpenCloseConfirmation}
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

        {/* Task Form */}
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
          shadow="0"
          borderRadius="full"
          borderWidth={3}
          borderColor="#FFFFFF"
          onPress={toggleTaskForm}
        >
          <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
        </Pressable>
      </SafeAreaView>

      {closeConfirmationIsOpen && (
        <ConfirmationModal
          isDelete={false}
          isOpen={closeConfirmationIsOpen}
          toggle={toggleCloseConfirmation}
          apiUrl={"/pm/tasks/close"}
          body={{ id: selectedTask?.id }}
          header="Close Task"
          description={`Are you sure to close task ${selectedTask?.title}?`}
          successMessage="Task closed"
          hasSuccessFunc
          onSuccess={refetchTasks}
        />
      )}
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
