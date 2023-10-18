import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Dimensions, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Center, Flex, Icon, Image, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import NewTaskSlider from "../../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import TaskViewSection from "../../../../components/Band/Project/ProjectTask/TaskViewSection";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import TaskFilter from "../../../../components/Band/shared/TaskFilter/TaskFilter";
import PageHeader from "../../../../components/shared/PageHeader";
import ConfirmationModal from "../../../../components/shared/ConfirmationModal";

const ProjectTaskScreen = ({ route }) => {
  const { width } = Dimensions.get("screen");
  const { projectId, view: viewType } = route.params;
  const navigation = useNavigation();
  const firstTimeRef = useRef(true);
  const [view, setView] = useState(viewType);
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTaskParameters = {
    label_id: selectedLabelId,
  };
  const { isOpen: closeConfirmationIsOpen, toggle: toggleCloseConfirmation } = useDisclosure(false);
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

  const onOpenTaskFormWithStatus = useCallback((status) => {
    toggleTaskForm();
    setSelectedStatus(status);
  }, []);

  const onCloseTaskForm = useCallback((resetForm) => {
    toggleTaskForm();
    resetForm();
    setSelectedStatus("Open");
  }, []);

  const onOpenCloseConfirmation = useCallback((task) => {
    toggleCloseConfirmation();
    setSelectedTask(task);
  }, []);

  const changeView = useCallback((value) => {
    setView(value);
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Flex gap={15} style={{ marginTop: 13, paddingHorizontal: 16 }}>
            <PageHeader
              title={data?.data.title}
              width={width - 65}
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
        </TouchableWithoutFeedback>

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
              openNewTaskForm={onOpenTaskFormWithStatus}
              openCloseTaskConfirmation={onOpenCloseConfirmation}
            />
          )}

          {(view === "Kanban" || view === "Gantt Chart") && (
            <Center>
              <Image
                source={require("../../../../assets/vectors/desktop.jpg")}
                h={250}
                w={250}
                alt="desktop-only"
                resizeMode="contain"
              />
              <Text bold>This feature only available for desktop</Text>
            </Center>
          )}
        </ScrollView>

        <Pressable
          position="absolute"
          right={5}
          bottom={81}
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

      {/* Task Form */}
      {taskFormIsOpen && (
        <NewTaskSlider
          isOpen={taskFormIsOpen}
          selectedStatus={selectedStatus}
          onClose={onCloseTaskForm}
          projectId={projectId}
          refetch={refetchTasks}
        />
      )}

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

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
});
