import React, { memo } from "react";

import { Flex, Icon, Pressable, Skeleton, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions } from "react-native";

const PageHeader = ({ width, title, backButton = true, withLoading, isLoading, onPress }) => {
  const { width: screenWidth } = Dimensions.get("screen");
  return (
    <Flex flexDir="row" style={{ gap: 6 }} maxWidth={width ? width : screenWidth - 45}>
      {backButton && (
        <Pressable onPress={onPress}>
          <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
        </Pressable>
      )}

      {withLoading ? (
        !isLoading ? (
          <Text fontSize={16} numberOfLines={2}>
            {title}
          </Text>
        ) : (
          <Skeleton h={8} w={200} />
        )
      ) : (
        <Text fontSize={16} numberOfLines={2}>
          {title}
        </Text>
      )}
    </Flex>
  );
};

export default memo(PageHeader);
