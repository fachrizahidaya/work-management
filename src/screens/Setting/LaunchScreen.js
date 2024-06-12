import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import jwt_decode from "jwt-decode";

import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { useDisclosure } from "../../hooks/useDisclosure";
import EULA from "../../components/layout/EULA";
import { init, fetchUser, fetchAgreement, insertAgreement } from "../../config/db";

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
      // const userData = await SecureStore.getItemAsync("user_data");
      // const token = await SecureStore.getItemAsync("user_token");
      // const agreeToEula = await SecureStore.getItemAsync("agree_to_terms");

      const storedAgreement = await fetchAgreement();
      const storedUser = await fetchUser();
      const userAgreement = storedAgreement[0]?.eula;
      const dataUser = storedUser[0]?.data;
      const dataToken = storedUser[0]?.token;

      if (
        // agreeToEula === "agreed"
        userAgreement === "agreed"
      ) {
        if (
          // token
          dataToken
        ) {
          const decodedToken = jwt_decode(
            // token
            dataToken
          );
          const isExpired = decodedToken.exp * 1000 < currentDate.getTime();

          if (!isExpired) {
            const parsedUserData = JSON.parse(
              // userData
              dataUser
            );

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
    try {
      // await SecureStore.setItemAsync("agree_to_terms", "agreed");
      await insertAgreement("agreed");
      // const userData = await SecureStore.getItemAsync("user_data");
      const storedUser = await fetchUser();
      const dataUser = storedUser[0]?.data;

      const parsedUserData =
        dataUser &&
        JSON.parse(
          // userData
          dataUser
        );

      toggleEula();

      if (
        // !userData
        !dataUser
      ) {
        navigation.navigate("Login");
      } else {
        loginHandler(parsedUserData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    init()
      .then(() => {
        getUserData();
      })
      .catch((err) => {
        console.log("initalization error", err);
      });
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
