import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { StyleSheet, View, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../hooks/useDisclosure";
import { useFetch } from "../../hooks/useFetch";
import TaskList from "../../components/Band/Task/TaskList/TaskList";
import TaskFilter from "../../components/Band/shared/TaskFilter/TaskFilter";
import PageHeader from "../../components/shared/PageHeader";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import useCheckAccess from "../../hooks/useCheckAccess";
import { useLoading } from "../../hooks/useLoading";

const AdHocScreen = () => {
  const navigation = useNavigation();
  const firstTimeRef = useRef(true);
  const [fullResponsibleArr, setFullResponsibleArr] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [responsibleId, setResponsibleId] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [deadlineSort, setDeadlineSort] = useState("asc");
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen: closeConfirmationIsOpen, toggle: toggleCloseConfirmation } = useDisclosure(false);
  const { isLoading: isInitialized, toggle: toggleInitialize } = useLoading();
  const createActionCheck = useCheckAccess("create", "Tasks");

  const fetchTaskParameters = {
    label_id: selectedLabelId,
    search: searchInput,
    responsible_id: responsibleId,
    priority: selectedPriority,
    sort_deadline: deadlineSort,
  };

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

  const onOpenCloseConfirmation = useCallback((task) => {
    toggleCloseConfirmation();
    setSelectedTask(task);
  }, []);

  useEffect(() => {
    // this operation will only be triggered everytime the array of responsible is at peak (maximum length).
    if (!isInitialized && responsibleArr?.length > 0) {
      const noDuplicateResponsibleArr = responsibleArr.reduce((acc, current) => {
        const isDuplicate = acc.some((item) => item.responsible_id === current.responsible_id);

        if (!isDuplicate && current.responsible_name !== null) {
          acc.push(current);
        }

        return acc;
      }, []);

      // should only run if the state of initialized is true
      setFullResponsibleArr(noDuplicateResponsibleArr);
      toggleInitialize();
    }
  }, [tasks?.data, isInitialized]);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ gap: 15, marginTop: 13, paddingHorizontal: 16 }}>
            <PageHeader title="Ad Hoc" backButton={false} />

            <View style={{ display: "flex", flexDirection: "row", marginTop: 11, marginBottom: 11 }}>
              <TaskFilter
                members={fullResponsibleArr}
                labels={labels}
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

        {createActionCheck && (
          <Pressable
            style={styles.hoverButton}
            onPress={() =>
              navigation.navigate("Task Form", {
                selectedStatus: selectedStatus,
                refetch: refetchTasks,
              })
            }
          >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}
      </View>

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
    </>
  );
};

export default AdHocScreen;

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
