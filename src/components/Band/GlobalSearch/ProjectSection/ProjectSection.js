import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RenderHTML from "react-native-render-html";

const ProjectSection = ({ projects, keyword }) => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("screen");

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderItem = (title) => {
    return boldMatchCharacters(title, keyword);
  };
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", color: "#176688" }}>PROJECTS</Text>

      {projects.map((project) => (
        <Pressable
          style={styles.item}
          key={project.id}
          onPress={() => navigation.navigate("Project Detail", { projectId: project.id })}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={"#176688"} />
          </View>

          <View style={{ flex: 1 }}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: renderItem(project.title),
              }}
            />
          </View>
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
