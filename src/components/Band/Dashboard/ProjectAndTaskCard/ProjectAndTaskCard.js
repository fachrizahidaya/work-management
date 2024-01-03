import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Skeleton } from "moti/skeleton";
import { StyleSheet, TouchableOpacity, View, Image, Text, Dimensions } from "react-native";

import { card } from "../../../../styles/Card";
import { SkeletonCommonProps } from "../../../shared/CustomStylings";

const ProjectAndTaskCard = ({ projects, tasks, projectIsLoading, taskIsLoading }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);
  const { width } = Dimensions.get("screen");

  return (
    <View style={styles.container}>
      {!projectIsLoading ? (
        <TouchableOpacity style={[card.card, { flex: 1 }]} onPress={() => navigation.navigate("Projects")}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../../../assets/icons/project_chart.png")}
              alt="project chart"
              style={styles.image}
            />
            <Text style={{ color: "gray" }}>On going projects</Text>
            <Text style={{ fontWeight: 500, fontSize: 20 }}>{projects}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Skeleton width={width / 2 - 20} height={160} radius={20} {...SkeletonCommonProps} />
      )}

      {!taskIsLoading ? (
        <TouchableOpacity style={[card.card, { flex: 1 }]} onPress={() => navigation.navigate("Tasks")}>
          <View style={styles.imageWrapper}>
            <Image source={require("../../../../assets/icons/task_chart.png")} alt="task chart" style={styles.image} />
            <Text style={{ color: "gray" }}>Total tasks</Text>
            <Text style={{ fontWeight: 500, fontSize: 20 }}>{tasks}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Skeleton width={width / 2 - 20} height={160} radius={20} {...SkeletonCommonProps} />
      )}
    </View>
  );
};

export default memo(ProjectAndTaskCard);

const styles = StyleSheet.create({
  container: {
    height: 160,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  image: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
});
