import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import jwt_decode from "jwt-decode";

import { Image, View } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

const LaunchScreen = () => {
  const navigation = useNavigation();

  const loginHandler = async (userData) => {
    try {
      navigation.navigate("Loading", { userData });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      let currentDate = new Date();
      const userData = await SecureStore.getItemAsync("user_data");
      const token = await SecureStore.getItemAsync("user_token");

      if (token) {
        const decodedToken = jwt_decode(token);
        const isExpired = decodedToken.exp * 1000 < currentDate.getTime();

        if (!isExpired) {
          const parsedUserData = JSON.parse(userData);

          loginHandler(parsedUserData);
        } else {
          navigation.navigate("Login");
        }
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
