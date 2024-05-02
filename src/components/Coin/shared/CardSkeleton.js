import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";

import { SkeletonCommonProps } from "../../shared/CustomStylings";
import { card } from "../../../styles/Card";

const CardSkeleton = () => {
  return (
    <View style={{ ...card.card, ...styles.wrapper }}>
      <View style={{ gap: 4, width: 200 }}>
        <Skeleton height={20} width="100%" radius={10} {...SkeletonCommonProps} />
      </View>
    </View>
  );
};

export default CardSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
