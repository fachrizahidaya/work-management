import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { Flex, Image, Skeleton, Text } from "native-base";
import { card } from "../../../../styles/Card";
import { TouchableOpacity } from "react-native";

const ProjectAndTaskCard = ({ projects, tasks, projectIsLoading, taskIsLoading }) => {
  const navigation = useNavigation();

  return (
    <Flex height={160} flexDir="row" gap={4} flex={1}>
      {!projectIsLoading ? (
        <TouchableOpacity onPress={() => navigation.navigate("Projects")} style={[card.card, { flex: 1 }]}>
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
        <TouchableOpacity onPress={() => navigation.navigate("Tasks")} style={[card.card, { flex: 1 }]}>
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
