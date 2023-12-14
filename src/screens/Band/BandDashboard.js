import React, { useMemo } from "react";

import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Flex, Skeleton } from "native-base";
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

  const data = useMemo(() => {
    return {
      labels: ["Open", "On Progress", "Finish"],
      // total tasks divided by task on that status length
      data:
        sumAllTasks !== 0
          ? [openTasks / sumAllTasks, onProgressTasks / sumAllTasks, finishTasks / sumAllTasks]
          : [0, 0, 0],
      colors: ["#176688", "#fcd241", "#FF965D"],
    };
  }, [openTasks, onProgressTasks, finishTasks, sumAllTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexWrapper}>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#176688" }}>Work</Text>
          <Text style={{ fontSize: 16 }}>Overview</Text>
        </View>

        <Text style={{ fontWeight: 700, fontSize: 14 }}>PT Kolabora Group Indonesia</Text>
      </View>

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
        <View style={styles.contentWrapper}>
          <ProjectAndTaskCard
            projects={projects?.data}
            tasks={tasks?.data}
            projectIsLoading={projectIsLoading}
            taskIsLoading={taskIsLoading}
          />

          {!tasksThisYearIsLoading ? (
            <ProgressChartCard data={data} open={openTasks} onProgress={onProgressTasks} finish={finishTasks} />
          ) : (
            // <Skeleton height={300} />
            <Text>Loading...</Text>
          )}

          <ActiveTaskCard />
        </View>
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
  flexWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingHorizontal: 14,
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
    gap: 14,
    marginVertical: 14,
  },
});
