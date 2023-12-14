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

import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  // Button,
  FormControl,
  // Icon,
  // Input,
  Image,
  // Text,
  Flex,
  Divider,
  // Pressable,
  Checkbox,
  useToast,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import axiosInstance from "../config/api";
import { ErrorToast } from "../components/shared/ToastDialog";
import { useLoading } from "../hooks/useLoading";

// For iOS
// WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  // const toast = useToast();
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
        toast.show({
          render: ({ id }) => {
            return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
          },
        });
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
  //     toast.show({
  //       render: () => {
  //         return <ErrorToast message={error.response.data.message} />;
  //       },
  //     });
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
      {/* <FormControl width="100%" isInvalid={formik.errors.email}> */}
      <Text>Email</Text>
      <TextInput
        size="md"
        placeholder="Insert your email..."
        onChangeText={(value) => formik.setFieldValue("email", value)}
        autoCapitalize="none"
      />
      <Text>{formik.errors.email}</Text>
      {/* </FormControl> */}

      {/* <FormControl width="100%" isInvalid={formik.errors.password}> */}
      <Text>Password</Text>
      <TextInput
        size="md"
        placeholder="Insert your password..."
        autoCapitalize="none"
        type={!hidePassword ? "text" : "password"}
        onChangeText={(value) => formik.setFieldValue("password", value)}
        InputRightElement={
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <MaterialIcons name={hidePassword ? "visibility" : "visibility-off"} />
          </TouchableOpacity>
        }
      />
      <Text>{formik.errors.password}</Text>
      {/* </FormControl> */}

      <Button
        onPress={formik.handleSubmit}
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting || isLoading}
        bgColor={formik.isSubmitting || isLoading ? "gray.500" : "primary.600"}
        isLoadingText="Loging in..."
        title="Log In"
      />
      {/* <Flex bg="white" borderRadius={15} py={38} gap={36} w="full" maxWidth={500} style={{ paddingHorizontal: 16 }}>
        <Flex gap={22} w="100%">
          <Flex gap={15} alignItems="center">
            <Image resizeMode="contain" source={require("../assets/icons/kss_logo.png")} alt="KSS_LOGO" h={45} w={45} />
            <Text fontSize={20}>Login</Text>
          </Flex>

          <Flex position="relative">
            <Image
              resizeMode="contain"
              source={require("../assets/icons/google.png")}
              alt="KSS_LOGO"
              style={{ width: 15, height: 16 }}
              position="absolute"
              zIndex={1}
              left={14}
              bottom={3}
            />

            <Button
              disabled={isLoading}
              variant="ghost"
              borderWidth={1}
              borderColor="#E8E9EB"
              bg="white"
              // onPress={() => {
              //   if (Platform.OS === "android") {
              //     onGoogleButtonPress();
              //   } else {
              //     promptAsync();
              //   }
              //   toggleLoading();
              // }}
              // onPress={() => {
              //   Platform.OS === "ios" && promptAsync();
              // }}
            >
              <Text fontSize={12} color="#595F69">
                {isLoading ? "Checking google account..." : "Login with Google"}
              </Text>
            </Button>
          </Flex>
        </Flex>
        
        <Flex position="relative" w="100%" alignItems="center" justifyContent="center">
          <Divider />
          <Box style={{ paddingHorizontal: 16 }} position="absolute" top={-10} bg="white">
            <Text color="#8A9099" fontWeight={400}>
              OR LOGIN WITH EMAIL
            </Text>
          </Box>
        </Flex>

        <Flex w="100%" style={{ gap: 20 }}>
          

          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <Flex>
              <Checkbox color="primary.600">
                <Text fontWeight={400}>Remember Me</Text>
              </Checkbox>
            </Flex>

            <Text color="primary.600" fontWeight={400}>
              Forgot Password?
            </Text>
          </Flex>
        </Flex>

        <Flex w="100%">
         
        </Flex>

        <Flex w="100%" flexDir="row" gap={1} justifyContent="center">
          <Text>Don't have an account?</Text>
          <Text color="primary.600">Sign Up</Text>
        </Flex>
      </Flex> */}
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
