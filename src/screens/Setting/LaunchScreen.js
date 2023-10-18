import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { Image, View } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import axiosInstance from "../../config/api";

const LaunchScreen = () => {
  const navigation = useNavigation();

  const loginHandler = async (form) => {
    try {
      const res = await axiosInstance.post("/auth/login", form);

      const userData = res.data.data;

      navigation.navigate("Loading", { userData });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync("user_data");

      if (userData) {
        const parsedUserData = JSON.parse(userData);
        loginHandler({
          email: parsedUserData.email,
          password: parsedUserData.password_real,
        });
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <Image
          resizeMode="contain"
          source={require("../../assets/icons/kss_logo.png")}
          alt="KSS_LOGO"
          style={styles.logo}
        />
      </View>
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
