import React, { memo } from "react";

import { Skeleton } from "moti/skeleton";
import { Dimensions, View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { SkeletonCommonProps, TextProps } from "./CustomStylings";

const PageHeader = ({ width, title, subTitle, backButton = true, withLoading, isLoading, onPress }) => {
  const { width: screenWidth } = Dimensions.get("screen");
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        maxWidth: width ? width : screenWidth - 45,
      }}
    >
      {backButton && (
        <Pressable onPress={onPress}>
          <MaterialCommunityIcons name="chevron-left" size={20} />
        </Pressable>
      )}

      {withLoading ? (
        !isLoading ? (
          <Text style={[{ fontSize: 16, fontWeight: 500 }, TextProps]} numberOfLines={2}>
            {title}
            {subTitle && <Text style={{ color: "#176688" }}> #{subTitle}</Text>}
          </Text>
        ) : (
          <Skeleton width={120} height={20} radius="round" {...SkeletonCommonProps} />
        )
      ) : (
        <Text style={[{ fontSize: 16, fontWeight: 500 }, TextProps]} numberOfLines={2}>
          {title}
          {subTitle && <Text style={{ color: "#176688" }}> #{subTitle}</Text>}
        </Text>
      )}
    </View>
  );
};

export default memo(PageHeader);
