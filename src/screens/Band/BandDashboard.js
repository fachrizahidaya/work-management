import React from "react";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Skeleton, Text } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import ProgressChartCard from "../../components/Band/Dashboard/ProgressChartCard/ProgressChartCard";
import ProjectAndTaskCard from "../../components/Band/Dashboard/ProjectAndTaskCard/ProjectAndTaskCard";
import ActiveTaskCard from "../../components/Band/Dashboard/ActiveTaskCard/ActiveTaskCard";
import { useFetch } from "../../hooks/useFetch";

const BandDashboard = () => {
  const {
    data: projects,
    isLoading: projectIsLoading,
    refetch: refetchProjects,
    isFetching: projectIsFetching,
  } = useFetch("/pm/projects/total");
  const {
    data: tasks,
    isLoading: taskIsLoading,
    refetch: refetchTasks,
    isFetching: taskIsFetching,
  } = useFetch("/pm/tasks/total");
  const {
    data: tasksThisYear,
    isLoading: tasksThisYearIsLoading,
    refetch: refetchTasksThisYear,
    isFetching: tasksThisYearIsFetching,
  } = useFetch("/pm/tasks/year-tasks");

  const refetchEverything = () => {
    refetchProjects();
    refetchTasks();
    refetchTasksThisYear();
  };

  const openTasks = tasksThisYear?.data?.total_open || 0;
  const onProgressTasks = tasksThisYear?.data?.total_onprogress || 0;
  const finishTasks = tasksThisYear?.data?.total_finish || 0;
  const sumAllTasks = openTasks + onProgressTasks + finishTasks;

  const data = {
    labels: ["Open", "On Progress", "Finish"],
    // total tasks divided by task on that status length
    data:
      sumAllTasks !== 0
        ? [openTasks / sumAllTasks, onProgressTasks / sumAllTasks, finishTasks / sumAllTasks]
        : [0, 0, 0],
    colors: ["#176688", "#fcd241", "#FF965D"],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        bgColor="white"
        py={14}
        style={{ paddingHorizontal: 16 }}
      >
        <Flex flexDir="row" gap={1}>
          <Text color="primary.600" fontWeight={700} fontSize={16}>
            Work
          </Text>
          <Text fontSize={16}>Overview</Text>
        </Flex>

        <Text fontWeight={700} fontSize={12}>
          PT Kolabora Group Indonesia
        </Text>
      </Flex>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={projectIsFetching && taskIsFetching && tasksThisYearIsFetching}
            onRefresh={refetchEverything}
          />
        }
      >
        <Flex flex={1} flexDir="column" gap={5} my={5}>
          {/* Content here */}
          <ProjectAndTaskCard
            projects={projects?.data}
            tasks={tasks?.data}
            projectIsLoading={projectIsLoading}
            taskIsLoading={taskIsLoading}
          />

          {!tasksThisYearIsLoading ? (
            <ProgressChartCard data={data} open={openTasks} onProgress={onProgressTasks} finish={finishTasks} />
          ) : (
            <Skeleton height={300} />
          )}

          <ActiveTaskCard />
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BandDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
});
