import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, KeyboardAvoidingView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Button, FormControl, Icon, Input, Image, Text, Flex, Divider, Pressable, Checkbox } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import axiosInstance from "../config/api";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const userSelector = useSelector((state) => state.auth);
  const [hidePassword, setHidePassword] = useState(true);

  /**
   * Handles the login process by sending a POST request to the authentication endpoint.
   * @function loginHandler
   * @param {Object} form - The login form data to be sent in the request.
   */
  const loginHandler = async (form) => {
    try {
      // Send a POST request to the authentication endpoint
      const res = await axiosInstance.post("/auth/login", form);

      // Extract user data from the response
      const userData = res.data.data;

      // Navigate to the "Loading" screen with user data
      navigation.navigate("Loading", { userData });
    } catch (error) {
      // Log any errors that occur during the login process
      console.log(error);

      // Rethrow the error to propagate it further if needed
      throw new Error("Login failed: " + error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "jeremy@kolabora.com",
      password: "Password123!",
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
   * Retrieves user data securely from storage and initiates the login process if data is found.
   */
  const getUserData = async () => {
    try {
      // Retrieve user data from SecureStore
      const userData = await SecureStore.getItemAsync("user_data");

      // If user data exists, initiate the login process
      if (userData) {
        // Parse the retrieved user data
        const parsedUserData = JSON.parse(userData);

        // Initiate login with email and password from user data
        loginHandler({
          email: parsedUserData.email,
          password: parsedUserData.password_real,
        });
      }
    } catch (error) {
      // Handle any errors that occur during the process
      throw new Error("Failed to retrieve user data: " + error.message);
    }
  };

  // Initiate the getUserData function
  useEffect(() => {
    getUserData();
  }, []);

  // Set formikIsSubmitting to false after user log in
  useEffect(() => {
    if (userSelector?.id) {
      formik.setSubmitting(false);
    }
  }, [userSelector?.id]);

  return (
    <KeyboardAvoidingView behavior="height" style={[styles.container, { height: height, width: width }]}>
      <Flex bg="white" borderRadius={15} py={38} style={{ paddingHorizontal: 16 }} gap={36}>
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
            <Button borderWidth={1} borderColor="#E8E9EB" bg="white" borderRadius={15} style={{ height: 40 }}>
              <Text fontSize={12} color="#595F69">
                Login with Google
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
          <FormControl width="100%" isInvalid={formik.errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              variant="unstyled"
              size="lg"
              onChangeText={(value) => formik.setFieldValue("email", value)}
              borderWidth={1}
              borderRadius={15}
              style={{ height: 40 }}
            />
            <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl width="100%" isInvalid={formik.errors.password}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              variant="unstyled"
              size="lg"
              borderWidth={1}
              borderRadius={15}
              style={{ height: 40 }}
              type={!hidePassword ? "text" : "password"}
              onChangeText={(value) => formik.setFieldValue("password", value)}
              InputRightElement={
                <Pressable onPress={() => setHidePassword(!hidePassword)}>
                  <Icon
                    as={<MaterialIcons name={hidePassword ? "visibility" : "visibility-off"} />}
                    size={5}
                    mr="3"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
            <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage>
          </FormControl>

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
          <Button onPress={formik.handleSubmit} isLoading={formik.isSubmitting} isLoadingText="Loging in...">
            Log In
          </Button>
        </Flex>

        <Flex w="100%" flexDir="row" gap={1} justifyContent="center">
          <Text>Don't have an account?</Text>
          <Text color="primary.600">Sign Up</Text>
        </Flex>
      </Flex>
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
  },
});

export default LoginScreen;
