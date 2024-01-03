import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Dimensions,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import TaskFilter from "../../../../components/Band/shared/TaskFilter/TaskFilter";
import PageHeader from "../../../../components/shared/PageHeader";
import ConfirmationModal from "../../../../components/shared/ConfirmationModal";
import useCheckAccess from "../../../../hooks/useCheckAccess";

const ProjectTaskScreen = ({ route }) => {
  const { width } = Dimensions.get("screen");
  const { projectId } = route.params;
  const navigation = useNavigation();
  const firstTimeRef = useRef(true);
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [responsibleId, setResponsibleId] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [deadlineSort, setDeadlineSort] = useState("asc");
  const [selectedTask, setSelectedTask] = useState(null);
  const createCheckAccess = useCheckAccess("create", "Tasks");

  const fetchTaskParameters = {
    label_id: selectedLabelId,
    search: searchInput,
    responsible_id: responsibleId,
    priority: selectedPriority,
    sort_deadline: deadlineSort,
  };

  const { isOpen: closeConfirmationIsOpen, toggle: toggleCloseConfirmation } = useDisclosure(false);

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const {
    data: tasks,
    isLoading: taskIsLoading,
    isFetching: taskIsFetching,
    refetch: refetchTasks,
  } = useFetch(
    `/pm/tasks/project/${projectId}`,
    [selectedLabelId, searchInput, responsibleId, selectedPriority, deadlineSort],
    fetchTaskParameters
  );
  const { data: members } = useFetch(`/pm/projects/${projectId}/member`);
  const { data: labels } = useFetch(`/pm/projects/${projectId}/label`);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ gap: 15, marginTop: 13, paddingHorizontal: 16 }}>
            <PageHeader
              title={data?.data.title}
              width={width - 65}
              withLoading
              isLoading={isLoading}
              onPress={() => navigation.navigate("Project Detail", { projectId: projectId })}
            />

            <View style={{ display: "flex", flexDirection: "row", marginTop: 11, marginBottom: 11 }}>
              <TaskFilter
                data={tasks?.data}
                members={members?.data}
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
        </TouchableWithoutFeedback>

        <TaskList
          tasks={tasks?.data}
          isLoading={taskIsLoading}
          openCloseTaskConfirmation={onOpenCloseConfirmation}
          isFetching={taskIsFetching}
          refetch={refetchTasks}
          setSelectedStatus={setSelectedStatus}
        />

        {createCheckAccess && (
          <Pressable
            style={styles.hoverButton}
            onPress={() =>
              navigation.navigate("Task Form", {
                selectedStatus: selectedStatus,
                refetch: refetchTasks,
                projectId: projectId,
              })
            }
          >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}
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

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
