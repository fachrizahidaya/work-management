import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TaskSection = ({ tasks }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>TASKS</Text>

      {tasks.map((task) => (
        <Pressable
          style={styles.item}
          key={task.id}
          onPress={() => navigation.navigate("Task Detail", { taskId: task.id })}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={"#8A9099"} />
          </View>
          <Text>{task.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default TaskSection;

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
