import React from "react";

import { StyleSheet } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const CloseOverlay = ({ toggle, isOpen }) => {
  const transitionStyling = useAnimatedStyle(() => ({
    opacity: withTiming(!isOpen ? 0.3 : 0),
    height: withTiming(!isOpen ? 0 : "100%"),
  }));

  return <Animated.View style={[styles.overlay, transitionStyling]} />;
};

export default CloseOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "black",
    zIndex: 5,
    width: "100%",
    height: 0,
    opacity: 1,
  },
  open: {
    opacity: 0.3,
    width: "100%",
    height: "100%",
  },
});
