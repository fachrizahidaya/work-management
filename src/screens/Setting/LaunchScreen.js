import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { Progress } from "native-base";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const LaunchScreen = ({ setIsLoading }) => {
  const [loadingValue, setLoadingValue] = useState(0);

  const updateLoadingValue = () => {
    setLoadingValue((prevValue) => prevValue + 1);
  };

  // Animate style for kss logo fade in
  const rStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      loadingValue <= 10
        ? 0
        : loadingValue > 10 && loadingValue <= 20
        ? 0.1
        : loadingValue > 20 && loadingValue <= 50
        ? 0.5
        : loadingValue > 50 && loadingValue <= 80
        ? 0.8
        : 1
    ),
  }));

  // Animate style for loading bar fade out
  const tStyle = useAnimatedStyle(() => ({
    opacity: withTiming(loadingValue < 100 ? 1 : 0),
  }));

  useEffect(() => {
    // Effect to update loadingValue at regular intervals
    const interval = setInterval(() => {
      if (loadingValue < 100) {
        updateLoadingValue();
      } else {
        // Set isLoading to false when loadingValue reaches 100
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 10);

    // Clean up the interval when the component unmounts or the dependencies change
    return () => {
      clearInterval(interval);
    };
  }, [loadingValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.loadingContainer}>
        <Animated.Image
          resizeMode="contain"
          source={require("../../assets/icons/kss_logo.png")}
          alt="KSS_LOGO"
          style={[styles.logo, rStyle]}
        />

        <Animated.View style={[styles.loadingIndicator, tStyle]}>
          <Progress value={loadingValue} colorScheme="primary" size="sm" bg="#E8E9EB" w={300} mt={50} />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LaunchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: 67,
    height: 67,
  },
});
