import React from "react";

import dayjs from "dayjs";

import { Box, Flex, HStack, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const TaskListItem = ({
  id,
  task,
  title,
  priority,
  deadline,
  image,
  totalAttachments,
  totalChecklists,
  totalChecklistsDone,
  totalComments,
  status,
  responsible,
  onPress,
  openCloseTaskConfirmation,
}) => {
  return (
    <Pressable style={styles.wrapper} onPress={() => onPress(task)}>
      <Flex gap={2}>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Flex flexDir="row" gap={3} alignItems="center">
            <Pressable
              display={status !== "Closed" || status !== "Finish" ? "none" : "block"}
              onPress={() => openCloseTaskConfirmation(task)}
            >
              <Icon
                as={<MaterialCommunityIcons name={status === "Closed" ? "check-circle-outline" : "circle-outline"} />}
                size="lg"
              />
            </Pressable>

            <Text textDecorationLine={status === "Closed" ? "line-through" : "none"}>
              {title.length > 20 ? title.slice(0, 20) + "..." : title}
            </Text>
          </Flex>

          <Flex flexDir="row" alignItems="center" gap={2}>
            <Icon as={<MaterialCommunityIcons name="calendar-blank" />} />

            <Text>{dayjs(deadline).format("MMM DD")}</Text>
          </Flex>
        </Flex>

        <Flex flexDir="row" gap={1} flex={1} ml={10}>
          <Box bgColor="#49C96D" w={3} h={3} borderRadius={50}></Box>
          {(priority === "Medium" || priority === "High") && (
            <Box bgColor="#FF965D" w={3} h={3} borderRadius={50}></Box>
          )}
          {priority === "High" && <Box bgColor="#FD7972" w={3} h={3} borderRadius={50}></Box>}
        </Flex>

        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <HStack space={5}>
            {totalAttachments > 0 && (
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon
                  as={<MaterialCommunityIcons name="attachment" />}
                  size="lg"
                  style={{ transform: [{ rotate: "-35deg" }] }}
                />
                <Text fontWeight={400}>{totalAttachments || 0}</Text>
              </Flex>
            )}

            {totalComments > 0 && (
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="message-text-outline" />} size="lg" />
                <Text fontWeight={400}>{totalComments || 0}</Text>
              </Flex>
            )}

            {totalChecklists > 0 && (
              <Flex flexDir="row" alignItems="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="checkbox-marked-outline" />} size="lg" />
                <Text fontWeight={400}>
                  {totalChecklistsDone || 0} / {totalChecklists || 0}
                </Text>
              </Flex>
            )}
          </HStack>

          <Flex flexDir="row" alignItems="center" gap={2}>
            {responsible && <AvatarPlaceholder image={image} name={responsible} />}
          </Flex>
        </Flex>
      </Flex>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 4,
    marginBottom: 4,
    marginHorizontal: 2,
    borderRadius: 15,
  },
});

export default TaskListItem;
