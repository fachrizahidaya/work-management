import React from "react";

import { Flex, Image, Skeleton, Text } from "native-base";
import { card } from "../../../../styles/Card";

const ProjectAndTaskCard = ({ projects, tasks, projectIsLoading, taskIsLoading }) => {
  return (
    <Flex height={160} flexDir="row" gap={4}>
      {!projectIsLoading ? (
        <Flex flex={1} alignItems="center" justifyContent="center" gap={1} style={card.card}>
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
      ) : (
        <Skeleton h={160} flex={1} />
      )}

      {!taskIsLoading ? (
        <Flex flex={1} alignItems="center" justifyContent="center" gap={1} style={card.card}>
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
      ) : (
        <Skeleton h={160} flex={1} />
      )}
    </Flex>
  );
};

export default ProjectAndTaskCard;
