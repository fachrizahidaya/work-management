import React from "react";

import { StyleSheet, View } from "react-native";
import { Skeleton } from "moti/skeleton";

import { SkeletonCommonProps } from "../../../shared/CustomStylings";

const TaskSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Skeleton show height={20} width={100} radius="round" {...SkeletonCommonProps} />

        <Skeleton show height={20} width={100} radius="round" {...SkeletonCommonProps} />
      </View>

      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Skeleton show height={15} width={15} radius="round" {...SkeletonCommonProps} />
          <Skeleton show height={15} width={15} radius="round" {...SkeletonCommonProps} />
          <Skeleton show height={15} width={15} radius="round" {...SkeletonCommonProps} />
        </View>

        <Skeleton show height={30} width={30} radius="round" {...SkeletonCommonProps} />
      </View>
    </View>
  );
};

export default TaskSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
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
    gap: 10,
  },
});
