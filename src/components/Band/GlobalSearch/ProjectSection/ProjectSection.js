import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProjectSection = ({ projects }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>PROJECTS</Text>

      {projects.map((project) => (
        <Pressable
          style={styles.item}
          key={project.id}
          onPress={() => navigation.navigate("Project Detail", { projectId: project.id })}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={"#8A9099"} />
          </View>
          <Text>{project.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ProjectSection;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    gap: 10,
  },
  icon: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#E8E9EB",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#E9E9EB",
  },
});
