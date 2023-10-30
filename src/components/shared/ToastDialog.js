import React from "react";

import { Alert, Box, HStack, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

const SuccessToast = ({ message, close }) => {
  return (
    <Alert
      variant="left-accent"
      status="success"
      w={width - 40}
      display="flex"
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <HStack alignItems="center" space={2}>
        <Icon as={<MaterialCommunityIcons name="check-circle" />} color="green.600" size="lg" />
        <Text width={200} numberOfLines={2}>
          {message}
        </Text>
      </HStack>
      <Pressable onPress={close}>
        <Icon as={<MaterialCommunityIcons name="close" />} size="lg" />
      </Pressable>
    </Alert>
  );
};

const ErrorToast = ({ message, close }) => {
  return (
    <Alert
      variant="left-accent"
      status="error"
      w={width - 40}
      display="flex"
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <HStack alignItems="center" space={2}>
        <Icon as={<MaterialCommunityIcons name="alert" />} color="red.600" size="lg" />
        <Text width={200} numberOfLines={2}>
          {message}
        </Text>
      </HStack>
      <Pressable onPress={close}>
        <Icon as={<MaterialCommunityIcons name="close" />} size="lg" />
      </Pressable>
    </Alert>
  );
};

export { SuccessToast, ErrorToast };
