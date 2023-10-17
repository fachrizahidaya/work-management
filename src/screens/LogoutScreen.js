import { SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Google authentication and firebase
// import { signOut } from "firebase/auth";
// import { auth } from "../config/firebase";

import { useDispatch, useSelector } from "react-redux";

import { Box, Flex, Progress, Text } from "native-base";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

import axiosInstance from "../config/api";
import { logout } from "../redux/reducer/auth";

const LogoutScreen = () => {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.auth);
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
        translateY: withSpring(loadingValue < 120 ? 0 : -200),
      },
    ],
    opacity: withTiming(loadingValue < 130 ? 1 : 0),
    height: 43,
    width: 43,
  }));

  /**
   * Handles the logout process by sending a POST request to the logout endpoint,
   * and then clearing user data and dispatching a logout action.
   */
  const logoutHandler = async () => {
    try {
      // Send a POST request to the logout endpoint

      await axiosInstance.post("/auth/logout");

      // Delete user data and token from SecureStore
      await SecureStore.deleteItemAsync("user_data");
      await SecureStore.deleteItemAsync("user_token");
      // await signOut(auth);
      // Dispatch a logout action
      dispatch(logout());
    } catch (error) {
      // Log any errors that occur during the logout process
      console.log(error);
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

    // Clean up the interval when the component unmounts or the dependencies change
    return () => {
      clearInterval(interval);
    };
  }, [loadingValue]);

  useEffect(() => {
    // Effect to initiate logout when loadingValue reaches 130
    if (loadingValue === 130) {
      // Delay the logout process using setTimeout
      const timeout = setTimeout(() => {
        logoutHandler();
      }, 0);

      // Clean up the timeout when the component unmounts or the dependencies change
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
              ? "Stepping out"
              : loadingValue > 40 && loadingValue <= 60
              ? "Clearing cache"
              : "Logging out"}
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
              h={43}
              w={43}
              style={uStyle}
            />

            <Box alignItems="center">
              <Text color="#979797">See you,</Text>
              <Text fontSize={16} color="primary.600" textAlign="center">
                {userSelector.name.length > 30 ? userSelector.name.split(" ")[0] : userSelector.name}
              </Text>
            </Box>
          </Flex>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default LogoutScreen;
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
