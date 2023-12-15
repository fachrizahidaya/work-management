import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useDisclosure } from "../../hooks/useDisclosure";
import { useFetch } from "../../hooks/useFetch";
import NewTaskSlider from "../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import TaskList from "../../components/Band/Task/TaskList/TaskList";
import TaskFilter from "../../components/Band/shared/TaskFilter/TaskFilter";
import PageHeader from "../../components/shared/PageHeader";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import useCheckAccess from "../../hooks/useCheckAccess";

const AdHocScreen = () => {
  const firstTimeRef = useRef(true);
  const [view, setView] = useState("Task List");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [responsibleId, setResponsibleId] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [deadlineSort, setDeadlineSort] = useState("asc");
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen: closeConfirmationIsOpen, toggle: toggleCloseConfirmation } = useDisclosure(false);
  const createActionCheck = useCheckAccess("create", "Tasks");

  const fetchTaskParameters = {
    label_id: selectedLabelId,
    search: searchInput,
    responsible_id: responsibleId,
    priority: selectedPriority,
    sort_deadline: deadlineSort,
  };

  const { isOpen: taskFormIsOpen, toggle: toggleTaskForm } = useDisclosure(false);

  const {
    data: tasks,
    isLoading: taskIsLoading,
    isFetching: taskIsFetching,
    refetch: refetchTasks,
  } = useFetch(
    `/pm/tasks`,
    [selectedLabelId, searchInput, responsibleId, selectedPriority, deadlineSort],
    fetchTaskParameters
  );
  const { data: labels } = useFetch(`/pm/labels`);

  // Get every task's responsible with no duplicates
  const responsibleArr = tasks?.data?.map((val) => {
    return { responsible_name: val.responsible_name, responsible_id: val.responsible_id };
  });

  const noDuplicateResponsibleArr = responsibleArr?.reduce((acc, current) => {
    const isDuplicate = acc.some((item) => item.responsible_id === current.responsible_id);

    if (!isDuplicate && current.responsible_name !== null) {
      acc.push(current);
    }

    return acc;
  }, []);

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
      <View style={styles.container}>
        <View style={{ display: "flex", gap: 15, marginTop: 13 }}>
          <PageHeader title="Ad Hoc" backButton={false} />

          <View style={{ display: "flex", flexDirection: "row", marginTop: 11, marginBottom: 11 }}>
            <TaskFilter
              data={tasks?.data}
              members={noDuplicateResponsibleArr}
              labels={labels}
              searchInput={searchInput}
              responsibleId={responsibleId}
              deadlineSort={deadlineSort}
              selectedPriority={selectedPriority}
              selectedLabelId={selectedLabelId}
              setSelectedLabelId={setSelectedLabelId}
              setSearchInput={setSearchInput}
              setResponsibleId={setResponsibleId}
              setDeadlineSort={setDeadlineSort}
              setSelectedPriority={setSelectedPriority}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={taskIsFetching} onRefresh={refetchTasks} />}
          style={{ marginBottom: 10 }}
        >
          {/* Task List view */}
          {view === "Task List" && (
            <TaskList
              tasks={tasks?.data}
              isLoading={taskIsLoading}
              openNewTaskForm={onOpenTaskFormWithStatus}
              openCloseTaskConfirmation={onOpenCloseConfirmation}
            />
          )}

          {(view === "Kanban" || view === "Gantt Chart") && (
            <View>
              <Image
                source={require("../../assets/vectors/desktop.jpg")}
                alt="desktop-only"
                style={{ height: 180, width: 250, resizeMode: "contain" }}
              />
              <Text style={{ fontWeight: "bold" }}>This feature only available for desktop</Text>
            </View>
          )}
        </ScrollView>

        {/* Task Form */}
        {/* {taskFormIsOpen && (
          <NewTaskSlider
            selectedStatus={selectedStatus}
            onClose={onCloseTaskForm}
            isOpen={taskFormIsOpen}
            refetch={refetchTasks}
          />
        )} */}

        {createActionCheck && (
          <Pressable style={styles.hoverButton} onPress={toggleTaskForm}>
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}
      </View>

      {/* {closeConfirmationIsOpen && (
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
      )} */}
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
  hoverButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    borderRadius: 50,
    backgroundColor: "#176688",
    padding: 15,
    elevation: 0,
    borderWidth: 3,
    borderColor: "white",
  },
});
