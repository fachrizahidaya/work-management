import { useNavigation } from "@react-navigation/core";
import { Box, Flex, Icon, Slide, Pressable, Text, FormControl, Input, useToast, Image, Button } from "native-base";
import { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { useFormik } from "formik";
import { Dimensions, Platform, SafeAreaView, StyleSheet, PermissionsAndroid, Alert } from "react-native";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { SuccessToast } from "../../shared/ToastDialog";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";

const NewFeedSlider = ({ isOpen, setIsOpen, fetchPost }) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const { width, height } = Dimensions.get("window");
  const toast = useToast();

  const postSubmitHandler = async (form) => {
    try {
      await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setIsOpen(!isOpen);
      fetchPost();
      toast.show({
        render: () => {
          return <SuccessToast message={`Posted succesfuly!`} />;
        },
      });
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
      if (values.type === "Public") {
        postSubmitHandler(formData);
        resetForm();
      } else {
        if (values.end_date) {
          postSubmitHandler(formData);
          resetForm();
        } else {
          throw new Error("For Announcement type, end date is required");
        }
      }
    },
  });

  const announcementToggleHandler = () => {
    if (formik.values.type === "Public") {
      formik.setFieldValue("type", "Announcement");
    } else {
      formik.setFieldValue("type", "Public");
      formik.setFieldValue("end_date", "");
    }
  };

  const dateDialogOpenHandler = () => {
    setDateDialogOpen(true);
  };

  const dateDialogCloseHandler = () => {
    setDateDialogOpen(false);
  };

  const pickImageHandler = async () => {
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

    // Handling for file information
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
    <Slide
      style={styles.container}
      in={isOpen}
      placement="bottom"
      duration={200}
      marginTop={Platform.OS === "android" ? 101 : 120}
    >
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable
            onPress={() => {
              setIsOpen(!isOpen);
              setImage(null);
            }}
          >
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Post
          </Text>
        </Flex>
      </Flex>
      <Box w={width} h={height} p={5}>
        <Flex gap={17} mt={22}>
          <FormControl isInvalid={formik.errors.content}>
            <Input
              minH={300}
              maxH={600}
              position="relative"
              backgroundColor="white"
              variant="unstyled"
              borderWidth={1}
              borderRadius={15}
              placeholder="Type something"
              multiline
              textAlignVertical="top"
              onChangeText={(value) => formik.setFieldValue("content", value)}
              value={formik.values.content}
            />
            <FormControl.ErrorMessage>{formik.errors.content}</FormControl.ErrorMessage>
            {image ? (
              <Box position="relative" mt={2} alignSelf="center">
                <Image source={{ uri: image.uri }} style={{ width: 300, height: 250 }} alt="image selected" />
                <Box
                  background="#377893"
                  borderWidth={2}
                  borderColor="white"
                  borderRadius="full"
                  padding="13px"
                  width={60}
                  height={60}
                >
                  <Pressable bottom={0} right={0} position="absolute" onPress={() => setImage(null)}>
                    <Icon as={<MaterialCommunityIcons name="trash-can-outline" />} size={10} color="white" />
                  </Pressable>
                </Box>
              </Box>
            ) : (
              <Box mt={2} style={styles.containerPicture}>
                <Text textAlign="center">No Preview Available</Text>
              </Box>
            )}

            <Flex top={220} right={3} position="absolute" justifyContent="space-between" flexDir="row">
              <Box
                background="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width={60}
                height={60}
              >
                <Pressable onPress={pickImageHandler}>
                  <Icon as={<MaterialIcons name="campaign" />} size={30} color="white" />
                </Pressable>
              </Box>
              <Box
                background="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width={60}
                height={60}
              >
                <Pressable onPress={pickImageHandler}>
                  <Icon as={<MaterialCommunityIcons name="calendar-month-outline" />} size={30} color="white" />
                </Pressable>
              </Box>
              <Box
                background="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width={60}
                height={60}
              >
                <Pressable onPress={pickImageHandler}>
                  <Icon as={<MaterialCommunityIcons name="image-outline" />} size={30} color="white" />
                </Pressable>
              </Box>
              <Box
                background="#377893"
                borderWidth={2}
                borderColor="white"
                borderRadius="full"
                padding="13px"
                width={60}
                height={60}
              >
                <Pressable onPress={formik.handleSubmit}>
                  <Icon as={<SimpleLineIcons name="paper-plane" />} size={30} color="white" />
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
  containerPicture: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderStyle: "dashed",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewFeedSlider;
