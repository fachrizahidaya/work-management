import React, { memo } from "react";

import { Flex, Icon, Pressable, Skeleton, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PageHeader = ({ title, backButton = true, withLoading, isLoading, onPress }) => {
  return (
    <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
      {backButton && (
        <Pressable onPress={onPress}>
          <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
        </Pressable>
      )}

      {withLoading ? (
        !isLoading ? (
          <Text fontSize={16}>{title}</Text>
        ) : (
          <Skeleton h={8} w={200} />
        )
      ) : (
        <Text fontSize={16}>{title}</Text>
      )}
    </Flex>
  );
};

export default memo(PageHeader);
