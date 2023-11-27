import React, { memo, useEffect, useRef } from "react";

import { Dimensions, StyleSheet } from "react-native";
import { HStack, Icon, IconButton, Text, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const InAppNotificationCard = ({ message, isOpen, close }) => {
  const autoCloseTimeout = useRef(null);
  const { width } = Dimensions.get("screen");

  const tStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen && message ? 1 : 0),
    left: withTiming(isOpen && message ? 0 : -100),
    width: width,
  }));

  // Clear the timeout when the close button is pressed
  const handlePressClose = () => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
    }
    close(); // Call the close function
  };

  useEffect(() => {
    if (isOpen) {
      // Set a timeout for automatic close after 5 seconds
      autoCloseTimeout.current = setTimeout(() => {
        close(); // Call the close function after 5 seconds
      }, 5000);
    }

    return () => {
      // Clear the timeout if the component unmounts or is closed manually
      if (autoCloseTimeout.current) {
        clearTimeout(autoCloseTimeout.current);
      }
    };
  }, [isOpen, close]);

  return (
    <Animated.View style={[styles.container, tStyle]}>
      <VStack>
        <HStack space={2} alignItems="baseline">
          <Text color="white" bold fontSize={16}>
            Nest
          </Text>

          <Text color="white" fontSize={12}>
            now
          </Text>
        </HStack>

        <Text color="white">
          {message?.from_name} :{" "}
          {message?.message?.length > 30 ? message?.message?.slice(0, 30) + "..." : message?.message}
        </Text>
      </VStack>

      <IconButton
        onPress={handlePressClose}
        icon={<Icon as={<MaterialCommunityIcons name="close" />} color="white" />}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#176688",
    padding: 20,
    position: "absolute",
    bottom: -80,
  },
});

export default memo(InAppNotificationCard);
