import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import jwt_decode from "jwt-decode";

import { Image, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { useDisclosure } from "../../hooks/useDisclosure";
import EULA from "../../components/layout/EULA";

const LaunchScreen = () => {
  const navigation = useNavigation();

  const { isOpen: eulaIsOpen, toggle: toggleEula } = useDisclosure(false);

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
      const agreeToEula = await SecureStore.getItemAsync("agree_to_terms");

      if (agreeToEula === "agreed") {
        if (token) {
          const decodedToken = jwt_decode(token);
          const isExpired = decodedToken.exp * 1000 < currentDate.getTime();

          if (!isExpired) {
            const parsedUserData = JSON.parse(userData);

            loginHandler(parsedUserData);
          }
        } else {
          navigation.navigate("Login");
        }
      } else {
        toggleEula();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const agreeToTermsHandler = async () => {
    await SecureStore.setItemAsync("agree_to_terms", "agreed");
    const userData = await SecureStore.getItemAsync("user_data");
    const parsedUserData = JSON.parse(userData);

    toggleEula();

    if (!userData) {
      navigation.navigate("Login");
    } else {
      loginHandler(parsedUserData);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <EULA isOpen={eulaIsOpen} toggle={agreeToTermsHandler} />
      <View style={styles.loadingContainer}>
        <Image source={require("../../assets/icons/kss_logo.png")} alt="KSS_LOGO" style={styles.logo} />
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
    resizeMode: "contain",
  },
});
