import { useNavigation } from "@react-navigation/core";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, Select, Button, useToast } from "native-base";
import { useState } from "react";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";

const NewFeedSlider = ({ isOpen, setIsOpen, onSubmit }) => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const toast = useToast();

  const [postId, setPostId] = useState(null);
  const { refetch: refetchAllPost } = useFetch("/hr/posts");

  const submitHandler = async (form, setType) => {
    try {
      const res = await axiosInstance.post("/hr/posts", form);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Box w={width} h={height} p={5} style={styles.container}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Post
          </Text>
        </Flex>
        <Flex gap={17} mt={22}>
          <FormControl
          // isInvalid={formik.errors.email}
          >
            <Input
              backgroundColor="white"
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              multiline
              minH={500}
              maxH={800}
              // onChangeText={(value) => formik.setFieldValue("email", value)}
              placeholder="Type something"
              textAlignVertical="top"
            />
            {/* <FormControl.ErrorMessage>{formik.errors.email}</FormControl.ErrorMessage> */}
          </FormControl>
          <Box
            bg="#377893"
            borderWidth={2}
            borderColor="white"
            borderRadius="full"
            padding="13px"
            width="60px"
            height="60px"
            position="absolute"
            top={400}
            right={5}
            zIndex={2}
          >
            <Pressable
              onPress={() => {
                setNewFeedIsOpen(!newFeedIsOpen);
              }}
            >
              <Icon as={<SimpleLineIcons name="paper-plane" />} size={30} color="white" />
            </Pressable>
          </Box>
        </Flex>
      </Box>
    </Slide>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
});

export default NewFeedSlider;
