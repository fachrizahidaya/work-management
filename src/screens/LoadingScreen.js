import { SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { useDispatch } from "react-redux";

import { Box, Flex, Progress, Text } from "native-base";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

import { login } from "../redux/reducer/auth";
import { setModule } from "../redux/reducer/module";

const LoadingScreen = ({ route }) => {
  const userData = route.params;
  const dispatch = useDispatch();
  const [loadingValue, setLoadingValue] = useState(0);

  // Increment loading value by 1 for certain interval time
  const updateLoadingValue = () => {
    setLoadingValue((prevValue) => prevValue + 1);
  };

  // Animate styling for the kss logo
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

  // Animate styling for the logo, loading text and the loading bar container
  const tStyle = useAnimatedStyle(() => ({
    opacity: withTiming(loadingValue < 100 ? 1 : 0),
  }));

  // Animate styling for the logo and text after the first loading is 100%
  const yStyle = useAnimatedStyle(() => ({
    opacity: withTiming(loadingValue < 100 ? 0 : 1),
    height: withSpring(loadingValue < 100 ? 0 : 238),
  }));

  // Animate styling for the logo fade in and drop down
  const uStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(loadingValue < 120 ? -200 : 0),
      },
    ],
    opacity: withTiming(
      loadingValue <= 105
        ? 0
        : loadingValue > 105 && loadingValue <= 110
        ? 0.1
        : loadingValue > 110 && loadingValue <= 115
        ? 0.25
        : loadingValue > 115 && loadingValue <= 120
        ? 0.5
        : 1
    ),
    height: 43,
    width: 43,
  }));

  /**
   * Sets user data and token securely.
   * This function dispatches a login action, stores user data and access token
   * securely using SecureStore in React Native.
   * @function setUserData
   * @throws {Error} If an error occurs while dispatching the login action or storing data.
   * @returns {Promise<void>} A promise that resolves when user data and token are stored.
   */
  const setUserData = async () => {
    try {
      // Store user data in SecureStore
      await SecureStore.setItemAsync("user_data", JSON.stringify(userData.userData));

      // Store user token in SecureStore
      await SecureStore.setItemAsync("user_token", userData.userData.access_token);

      // Dispatch band module to firstly be rendered
      dispatch(setModule("BAND"));

      // Dispatch a login action with the provided user data
      dispatch(login(userData.userData));
    } catch (error) {
      // Handle any errors that occur during the process
      throw new Error("Failed to set user data: " + error.message);
    }
  };

  useEffect(() => {
    // Effect to update loadingValue at regular intervals
    const interval = setInterval(() => {
      if (loadingValue < 130) {
        updateLoadingValue();
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [loadingValue]);

  useEffect(() => {
    // Effect to trigger user data update when loadingValue reaches 130
    if (loadingValue === 130) {
      const timeout = setTimeout(() => {
        setUserData();
      }, 0);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loadingValue]);

  return (
    <SafeAreaView style={styles.container}>
      {loadingValue < 100 && (
        <Animated.View style={[styles.loadingContainer, tStyle]}>
          <Animated.Image
            resizeMode="contain"
            source={require("../assets/icons/kss_logo.png")}
            alt="KSS_LOGO"
            style={[styles.logo, rStyle]}
          />
          <Text color="#979797">
            {loadingValue <= 40
              ? "Logging in"
              : loadingValue > 40 && loadingValue <= 60
              ? "Loading your dashboard"
              : "Preparing your dashboard"}
          </Text>
          <Progress value={loadingValue} colorScheme="primary" size="sm" bg="#E8E9EB" w={300} mt={50} />
        </Animated.View>
      )}

      {loadingValue >= 100 && (
        <Animated.View style={[styles.profileBox, yStyle]}>
          <Flex bg="#E7E7E7" alignItems="center" justifyContent="center" gap={25} style={styles.profileBox}>
            <Animated.Image
              resizeMode="contain"
              source={require("../assets/icons/kss_logo.png")}
              alt="KSS_LOGO"
              style={uStyle}
            />

            <Box alignItems="center">
              <Text color="#979797">Welcome,</Text>
              <Text fontSize={16} color="primary.600" textAlign="center">
                {userData.userData.name.length > 30 ? userData.userData.name.split(" ")[0] : userData.userData.name}
              </Text>
            </Box>
          </Flex>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default LoadingScreen;

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
  profileBox: {
    display: "flex",
    width: 252,
    height: "100%",
    borderRadius: 10,
    gap: 20,
  },
});
