import React from "react";

import { StyleSheet } from "react-native";
import { Flex, HStack, Skeleton } from "native-base";

const TaskSkeleton = () => {
  return (
    <Flex style={styles.wrapper}>
      <HStack space={2}>
        <Skeleton flex={3} h={31} />
        <Skeleton flex={1} h={31} />
      </HStack>
      <HStack space={1}>
        <Skeleton h={21} borderRadius="full" w={21} />
        <Skeleton h={21} borderRadius="full" w={21} />
        <Skeleton h={21} borderRadius="full" w={21} />
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <Skeleton h={21} borderRadius="full" w={41} />
        <Skeleton h={31} borderRadius="full" w={31} />
      </HStack>
    </Flex>
  );
};

export default TaskSkeleton;

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
    gap: 5,
  },
});
