import React, { useEffect } from "react";

import { Dimensions, StyleSheet, Platform } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * @param {ReactNode} children - The content to be displayed within the drawer.
 * @param {string|number} height - The height of the drawer. Default is "100%".
 * @param {boolean} isOpen - Whether the drawer is open or closed.
 */
const CustomDrawer = ({ children, height, isOpen }) => {
  // Set custom height or default to "100%"
  const customHeight = height || "100%";

  // Get the width of the window
  const { width } = Dimensions.get("window");

  // Create a shared value for animation
  const translateX = useSharedValue(0);

  // Update the animation value based on the isOpen prop
  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : width, {
      duration: 150,
    });
  }, [isOpen]);

  // Create an animated style for the drawer
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
    height: customHeight,
  }));

  return (
    <PanGestureHandler>
      <Animated.View style={[styles.container, rStyle]}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "absolute",
    top: Platform.OS === "android" ? -20 : -40,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 125,
    zIndex: 1,
  },
});
