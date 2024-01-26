import React from "react";

import { StyleSheet, View } from "react-native";

import TeamSection from "../TeamSection/TeamSection";
import ProjectSection from "../ProjectSection/ProjectSection";
import TaskSection from "../TaskSection/TaskSection";

const GlobalSearchItems = ({ data }) => {
  const { project, task, team } = data;

  return (
    <View style={styles.flex}>
      {team?.length > 0 && <TeamSection teams={team} />}
      {project?.length > 0 && <ProjectSection projects={project} />}
      {task?.length > 0 && <TaskSection tasks={task} />}
    </View>
  );
};

export default GlobalSearchItems;

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    gap: 20,
  },
});
