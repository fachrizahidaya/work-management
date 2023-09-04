import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Pressable, Skeleton, Text, useSafeArea, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import TaskList from "../../../../components/Band/Task/TaskList/TaskList";
import NewTaskSlider from "../../../../components/Band/Task/NewTaskSlider/NewTaskSlider";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";
import CustomDrawer from "../../../../components/shared/CustomDrawer";
import TaskDetail from "../../../../components/Band/Task/TaskDetail/TaskDetail";

const ProjectTaskScreen = ({ route }) => {
  const { height } = Dimensions.get("window");
  const toast = useToast();
  const { projectId } = route.params;
  const navigation = useNavigation();
  const [view, setView] = useState("Task List");
  const [newTaskIsOpen, setNewTaskIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const onPressHandler = (task) => {
    setIsOpen(!isOpen);
    setSelectedTask(task);
  };

  const closeTaskDetailHandler = () => {
    setIsOpen(!isOpen);
    setSelectedTask(null);
  };

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
  });

  const changeView = (value) => {
    setView(value);
  };

  const submitHandler = async (form, task, status, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post("/pm/tasks", {
        project_id: projectId,
        status: status,
        ...form,
      });
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: () => {
          return <SuccessToast message={`Task saved!`} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const { data: tasks, isLoading: taskIsLoading } = useFetch(`/pm/tasks/project/${projectId}`);

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

            <Button onPress={() => setNewTaskIsOpen(true)}>
              <Flex flexDir="row" gap={6} alignItems="center" px={2}>
                <Text color="white">Add</Text>

                <Box alignItems="center" bgColor="#2d6076" borderRadius={10} p={2}>
                  <Icon as={<MaterialCommunityIcons name="plus" />} color="white" />
                </Box>
              </Flex>
            </Button>
          </Flex>
        </Flex>

        {view === "Task List" && <TaskList tasks={tasks?.data} isLoading={taskIsLoading} openDetail={onPressHandler} />}
      </ScrollView>

      <NewTaskSlider isOpen={newTaskIsOpen} setIsOpen={setNewTaskIsOpen} submitHandler={submitHandler} />

      <CustomDrawer isOpen={isOpen} height={height}>
        <TaskDetail safeAreaProps={safeAreaProps} onClick={closeTaskDetailHandler} selectedTask={selectedTask} />
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
