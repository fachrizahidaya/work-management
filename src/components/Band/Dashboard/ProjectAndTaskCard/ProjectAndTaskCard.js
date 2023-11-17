import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Flex, Image, Skeleton, Text } from "native-base";
import { TouchableOpacity } from "react-native";

import { card } from "../../../../styles/Card";

const ProjectAndTaskCard = ({ projects, tasks, projectIsLoading, taskIsLoading }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  return (
    <Flex height={160} flexDir="row" gap={4} flex={1}>
      {!projectIsLoading ? (
        <TouchableOpacity
          onPress={() => {
            menuSelector?.user_menu?.menu[1]?.sub[0]?.is_allow && navigation.navigate("Projects");
          }}
          style={[card.card, { flex: 1 }]}
        >
          <Flex flex={1} alignItems="center" justifyContent="center" gap={1}>
            <Image
              source={require("../../../../assets/icons/project_chart.png")}
              height={50}
              alt="project chart"
              resizeMode="contain"
            />
            <Text color="muted.500">On going project</Text>
            <Text fontWeight={500} fontSize={20}>
              {projects}
            </Text>
          </Flex>
        </TouchableOpacity>
      ) : (
        <Skeleton h={160} flex={1} />
      )}

      {!taskIsLoading ? (
        <TouchableOpacity
          onPress={() => {
            menuSelector?.user_menu?.menu[1]?.sub[1]?.is_allow && navigation.navigate("Tasks");
          }}
          style={[card.card, { flex: 1 }]}
        >
          <Flex flex={1} alignItems="center" justifyContent="center" gap={1}>
            <Image
              source={require("../../../../assets/icons/task_chart.png")}
              height={50}
              alt="task chart"
              resizeMode="contain"
            />
            <Text color="muted.500">Total tasks</Text>
            <Text fontWeight={500} fontSize={20}>
              {tasks}
            </Text>
          </Flex>
        </TouchableOpacity>
      ) : (
        <Skeleton h={160} flex={1} />
      )}
    </Flex>
  );
};

export default memo(ProjectAndTaskCard);
