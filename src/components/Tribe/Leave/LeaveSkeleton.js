import React from "react";

import { StyleSheet, View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { SkeletonCommonProps } from "../../shared/CustomStylings";

const LeaveSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      <View style={{ display: "flex", gap: 4, width: 200 }}>
        <Skeleton height={20} width="100%" radius={10} {...SkeletonCommonProps} />
        <Skeleton height={20} width={120} radius={10} {...SkeletonCommonProps} />
        <Skeleton height={20} width={20} radius={10} {...SkeletonCommonProps} />
      </View>

      <Skeleton height={20} width={80} radius={10} {...SkeletonCommonProps} />
    </View>
  );
};

export default LeaveSkeleton;

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
