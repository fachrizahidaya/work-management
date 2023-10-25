import React from "react";

import { StyleSheet } from "react-native";
import { Flex, Skeleton } from "native-base";

const ProjectSkeleton = () => {
  return (
    <Flex style={styles.wrapper}>
      <Flex gap={2} w={200}>
        <Skeleton h={21} />
        <Skeleton h={21} w={120} />
        <Skeleton h={21} w={21} />
      </Flex>

      <Skeleton h={21} w={79} />
    </Flex>
  );
};

export default ProjectSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#cbcbcb",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});
