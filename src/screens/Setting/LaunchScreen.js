import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const handleGetUserData = async () => {
    try {
      let currentDate = new Date();
      const userData = await AsyncStorage.getItem("user_data");
      const token = await AsyncStorage.getItem("user_token");
      const agreeToEula = await AsyncStorage.getItem("agree_to_terms");

      if (agreeToEula === "agreed") {
        if (token) {
          const decodedToken = jwt_decode(token);
          const isExpired = decodedToken.exp * 1000 < currentDate.getTime();

          if (!isExpired) {
            const parsedUserData = JSON.parse(userData);
            console.log("p", parsedUserData);

            loginHandler(parsedUserData);
          }
        } else {
          navigation.navigate("Login");
        }
      } else {
        toggleEula();
      }
    } catch (err) {
      console.log(err);
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

  const handleAgreeToTerms = async () => {
    try {
      await AsyncStorage.setItem("agree_to_terms", "agreed");
      const userData = await AsyncStorage.getItem("user_data");
      const parsedUserData = JSON.parse(userData);

      toggleEula();

      if (!userData) {
        navigation.navigate("Login");
      } else {
        loginHandler(parsedUserData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const agreeToTermsHandler = async () => {
    try {
      await SecureStore.setItemAsync("agree_to_terms", "agreed");
      const userData = await SecureStore.getItemAsync("user_data");
      const parsedUserData = JSON.parse(userData);

      toggleEula();

      if (!userData) {
        navigation.navigate("Login");
      } else {
        loginHandler(parsedUserData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // if (Platform.OS === "ios") {
    getUserData();
    // } else {
    //   handleGetUserData();
    // }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <EULA
        isOpen={eulaIsOpen}
        toggle={
          // Platform.OS === "ios" ?
          agreeToTermsHandler
          // : handleAgreeToTerms
        }
      />
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
