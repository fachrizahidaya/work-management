import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Skeleton } from "native-base";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

import { card } from "../../../../styles/Card";

const ProjectAndTaskCard = ({ projects, tasks, projectIsLoading, taskIsLoading }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  return (
    <View style={styles.container}>
      {!projectIsLoading ? (
        <TouchableOpacity
          onPress={() => {
            menuSelector?.user_menu?.menu[1]?.sub[0]?.is_allow && navigation.navigate("Projects");
          }}
          style={[card.card, { flex: 1 }]}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../../../assets/icons/project_chart.png")}
              alt="project chart"
              style={styles.image}
            />
            <Text style={{ color: "gray" }}>On going project</Text>
            <Text style={{ fontWeight: 500, fontSize: 20 }}>{projects}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        // <Skeleton h={160} flex={1} />
        <Text>Loading...</Text>
      )}

      {!taskIsLoading ? (
        <TouchableOpacity
          onPress={() => {
            menuSelector?.user_menu?.menu[1]?.sub[1]?.is_allow && navigation.navigate("Tasks");
          }}
          style={[card.card, { flex: 1 }]}
        >
          <View style={styles.imageWrapper}>
            <Image source={require("../../../../assets/icons/task_chart.png")} alt="task chart" style={styles.image} />
            <Text style={{ color: "gray" }}>Total tasks</Text>
            <Text style={{ fontWeight: 500, fontSize: 20 }}>{tasks}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        // <Skeleton h={160} flex={1} />
        <Text>Loading...</Text>
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
