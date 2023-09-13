import { useNavigation } from "@react-navigation/core";
import {
  Box,
  Flex,
  Icon,
  Slide,
  Pressable,
  Text,
  FormControl,
  Input,
  Select,
  Button,
  useToast,
  Image,
} from "native-base";
import { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { useFormik } from "formik";
import { Dimensions, Platform, SafeAreaView, StyleSheet, PermissionsAndroid, Alert } from "react-native";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { ErrorToast } from "../../shared/ToastDialog";

const NewFeedSlider = ({ isOpen, setIsOpen, onSubmit }) => {
  const [postId, setPostId] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const toast = useToast();

  const { refetch: refetchAllPost } = useFetch("/hr/posts");

  const submitHandler = async (form) => {
    try {
      await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setIsOpen(!isOpen);
    } catch (err) {
      console.log(err);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      type: "Public",
      end_date: "",
    },
    validationSchema: yup.object().shape({
      content: yup.string().required("Content is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      formData.append("file", image);
      submitHandler(formData);
      resetForm();
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    // Handling for size
    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

    if (result) {
      setImage({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  return (
    <Slide in={isOpen} placement="bottom" duration={200} marginTop={Platform.OS === "android" ? 101 : 120}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Post
          </Text>
        </Flex>
      </Flex>
      <Box w={width} h={height} p={5} style={styles.container}>
        <Flex gap={17} mt={22}>
          <FormControl isInvalid={formik.errors.content}>
            <Input
              backgroundColor="white"
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              // multiline
              minH={200}
              maxH={600}
              onChangeText={(value) => formik.setFieldValue("content", value)}
              placeholder="Type something"
              textAlignVertical="top"
              value={formik.values.content}
            />
            <FormControl.ErrorMessage>{formik.errors.content}</FormControl.ErrorMessage>
            <Box alignItems="center">
              {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} alt="image selected" />}
            </Box>
            <Flex flexDir="row-reverse">
              <Box
                bg="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width="60px"
                height="60px"
              >
                <Pressable onPress={formik.handleSubmit}>
                  <Icon as={<SimpleLineIcons name="paper-plane" />} size={30} color="white" />
                </Pressable>
              </Box>
              <Box
                bg="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width="60px"
                height="60px"
              >
                <Pressable onPress={pickImage}>
                  <Icon as={<MaterialCommunityIcons name="image-outline" />} size={30} color="white" />
                </Pressable>
              </Box>
            </Flex>
          </FormControl>
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
