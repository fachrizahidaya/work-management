import React from "react";

import dayjs from "dayjs";
import { useSelector } from "react-redux";

import { Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const StatusAndDeadlineSection = ({ no, task, title, deadline, status, responsibleId, openCloseTaskConfirmation }) => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
      <Flex flexDir="row" gap={3} alignItems="center">
        {status === "Closed" || status === "Finish" ? (
          <Pressable
            onPress={() => {
              if (status === "Finish" && userSelector.id === responsibleId) {
                openCloseTaskConfirmation(task);
              }
            }}
          >
            <Icon
              as={<MaterialCommunityIcons name={status === "Closed" ? "check-circle-outline" : "circle-outline"} />}
              size="lg"
            />
          </Pressable>
        ) : null}

        <Text w={190} numberOfLines={2} textDecorationLine={status === "Closed" ? "line-through" : "none"}>
          {title}
          <Text color="primary.600"> #{no}</Text>
        </Text>

        <Flex flexDir="row" alignItems="center" gap={2}>
          <Icon as={<MaterialCommunityIcons name="calendar-blank" />} />
          <Text>{dayjs(deadline).format("MMM DD")}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StatusAndDeadlineSection;
