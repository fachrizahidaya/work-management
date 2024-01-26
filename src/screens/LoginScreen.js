import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

// For iOS
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
// import { auth as auths } from "../config/firebase";
// For android
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Toast from "react-native-root-toast";

import { StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Text, View, Image } from "react-native";

import axiosInstance from "../config/api";
import { useLoading } from "../hooks/useLoading";
import Input from "../components/shared/Forms/Input";
import FormButton from "../components/shared/FormButton";
import { ErrorToastProps, TextProps } from "../components/shared/CustomStylings";

// For iOS
// WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [hidePassword, setHidePassword] = useState(true);
  const { isLoading, toggle: toggleLoading } = useLoading(false);

  // This is firebase configurations for iOS
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
  //   androidClientId: "",
  // });

  // This is firebase configurations for android
  // GoogleSignin.configure({
  //   webClientId: "994028386897-h6u6pnb07bjgng1vq77v6jdr3fgm7utp.apps.googleusercontent.com",
  // });

  // const onGoogleButtonPress = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  //     await GoogleSignin.revokeAccess();

  //     const { idToken } = await GoogleSignin.signIn();

  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //     const userCredentials = await auth().signInWithCredential(googleCredential);

  //     signInWithGoogle(userCredentials.user._user);
  //   } catch (error) {
  //     toggleLoading();
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("Please use correct email format").required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      loginHandler(values);
    },
  });

  /**
   * Handles the login process by sending a POST request to the authentication endpoint.
   * @function loginHandler
   * @param {Object} form - The login form data to be sent in the request.
   * Some how i need to make it .then .catch format because the error wont be catched if i use
   * the try catch format. Weird...
   */
  const loginHandler = async (form) => {
    await axiosInstance
      .post("/auth/login", form)
      .then(async (res) => {
        // Extract user data from the response
        const userData = res.data.data;

        const userToken = userData.access_token.replace(/"/g, "");

        // Get firebase messaging token for push notification
        const fbtoken = await messaging().getToken();

        await axios
          .post(
            `${process.env.EXPO_PUBLIC_API}/auth/create-firebase-token`,
            {
              firebase_token: fbtoken,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then(async () => {
            await SecureStore.setItemAsync("firebase_token", fbtoken);
            navigation.navigate("Loading", { userData });
          });

        navigation.navigate("Loading", { userData });
        formik.setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        formik.setSubmitting(false);

        Toast.show(error.response.data.message, ErrorToastProps);
      });
  };

  // const signInWithGoogle = async (user) => {
  //   try {
  //     const res = await axiosInstance.post("/auth/login-with-google", {
  //       uid: user.uid,
  //       email: user.email,
  //     });
  //     toggleLoading();
  //     const userData = res.data.data;

  //     // Navigate to the "Loading" screen with user data
  //     navigation.navigate("Loading", { userData });
  //   } catch (error) {
  //     console.log(error);
  //     toggleLoading();
  //     Toast.show(error.response.data.message, ErrorToastProps);
  //   }
  // };

  // Initiate the getUserData function

  // useEffect(() => {
  //   if (response?.type == "success") {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auths, credential);
  //   } else if (response?.type === "cancel") {
  //     toggleLoading();
  //   }
  // }, [response]);

  // useEffect(() => {
  //   if (Platform.OS === "ios") {
  //     const unsubscribe = onAuthStateChanged(auths, async (user) => {
  //       if (user) {
  //         signInWithGoogle(user);
  //       }
  //     });
  //     return () => unsubscribe();
  //   }
  // }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={[styles.container, { height: height, width: width }]}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          paddingVertical: 38,
          paddingHorizontal: 16,
          display: "flex",
          gap: 36,
          maxWidth: 500,
          width: "100%",
        }}
      >
        <View style={{ display: "flex", gap: 22, width: "100%" }}>
          <View style={{ display: "flex", gap: 15, alignItems: "center" }}>
            <Image
              style={{ height: 55, width: 55, resizeMode: "contain" }}
              source={require("../assets/icons/kss_logo.png")}
              alt="KSS_LOGO"
            />
            <Text style={[{ fontSize: 20, fontWeight: 500 }, TextProps]}>Login</Text>
          </View>

          {/* <View style={{ position: "relative", borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB" }}>
            <Image
              source={require("../assets/icons/google.png")}
              alt="KSS_LOGO"
              style={{
                height: 16,
                width: 15,
                resizeMode: "contain",
                position: "absolute",
                zIndex: 1,
                left: 14,
                bottom: 12,
              }}
            />
            <FormButton disabled={isLoading} backgroundColor="white" fontSize={12} fontColor="#595F69">
              <Text style={TextProps}>{isLoading ? "Checking google account..." : "Login with Google"}</Text>
            </FormButton>

            <Button
              disabled={isLoading}
              variant="ghost"
              borderWidth={1}
              borderColor="#E8E9EB"
              bg="white"
              onPress={() => {
                if (Platform.OS === "android") {
                  onGoogleButtonPress();
                } else {
                  promptAsync();
                }
                toggleLoading();
              }}
              onPress={() => {
                Platform.OS === "ios" && promptAsync();
              }}
            >
              <Text fontSize={12} color="#595F69">
                {isLoading ? "Checking google account..." : "Login with Google"}
              </Text>
            </Button>
          </View> */}
        </View>

        {/* <View
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ borderWidth: 1, borderColor: "#E8E9EB", width: "100%" }} />

          <View style={{ paddingHorizontal: 16, position: "absolute", top: -8, backgroundColor: "white" }}>
            <Text style={{ color: "#8A9099", fontWeight: 400 }}>OR LOGIN WITH EMAIL</Text>
          </View>
        </View> */}

        <View style={{ display: "flex", gap: 10, width: "100%" }}>
          <Input fieldName="email" title="Email" formik={formik} placeHolder="Insert your email..." />

          <Input
            fieldName="password"
            title="Password"
            formik={formik}
            placeHolder="Insert your password..."
            secureTextEntry={hidePassword}
            endIcon={hidePassword ? "eye-outline" : "eye-off-outline"}
            onPressEndIcon={() => setHidePassword(!hidePassword)}
          />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit} fontColor="white">
            <Text style={{ color: "white" }}>Log In</Text>
          </FormButton>

          <View
            style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#176688", fontWeight: 400 }}>Forgot Password?</Text>
          </View>
        </View>

        <View style={{ width: "100%" }} />

        <View style={{ display: "flex", flexDirection: "row", width: "100%", gap: 2, justifyContent: "center" }}>
          <Text style={TextProps}>Don't have an account?</Text>
          <Text style={{ color: "#176688" }}>Sign Up</Text>
        </View>
      </View>

      {/* <View>
              <Checkbox color="primary.600">
                <Text fontWeight={400}>Remember Me</Text>
              </Checkbox>
            </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
