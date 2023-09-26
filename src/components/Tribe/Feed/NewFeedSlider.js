import { Box, Flex, Icon, Pressable, Text, FormControl, Input, useToast, Image } from "native-base";
import { useState } from "react";
import axiosInstance from "../../../config/api";
import { useFormik } from "formik";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { SuccessToast } from "../../shared/ToastDialog";
import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";

const NewFeedSlider = ({ refetch, toggle }) => {
  const [dateShown, setDateShown] = useState(false);
  const [image, setImage] = useState(null);
  const [isPressed, setIsPressed] = useState();
  const [selectedOption, setSelectedOption] = useState("Public");
  const { width, height } = Dimensions.get("window");
  const toast = useToast();

  const postSubmitHandler = async (form) => {
    try {
      await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      toggle();
      refetch();
      toast.show({
        render: () => {
          return <SuccessToast message={`Posted succesfuly!`} />;
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const endDateAnnouncementHandler = (value) => {
    formik.setFieldValue("end_date", value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      type: selectedOption || "Public",
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
      setSelectedOption("Announcement");
      formik.setFieldValue("type", "Announcement");
      setIsPressed(true);
      setDateShown(true);
      toast.show({ description: "Set to Announcement" });
    } else {
      formik.setFieldValue("type", "Public");
      formik.setFieldValue("end_date", "");
      setIsPressed(false);
      setDateShown(false);
      toast.show({ description: "Set to Public" });
    }
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
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="#FAFAFA" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable
            onPress={() => {
              toggle();
              setImage(null);
            }}
          >
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Post
          </Text>
        </Flex>
        <Flex mt={22}>
          <FormControl isInvalid={formik.errors.content}>
            <Input
              minH={300}
              maxH={600}
              position="relative"
              borderRadius={15}
              variant="unstyled"
              placeholder="What's happening?"
              multiline
              textAlignVertical="top"
              onChangeText={(value) => formik.setFieldValue("content", value)}
              value={formik.values.content}
              fontSize="lg"
            />
            {image ? (
              <Box position="relative" mt={2} alignSelf="center">
                <Image source={{ uri: image.uri }} style={{ width: 300, height: 250 }} alt="image selected" />
                <Box
                  backgroundColor="danger.800"
                  borderRadius="full"
                  padding="13px"
                  top={1}
                  right={1}
                  position="absolute"
                >
                  <Pressable onPress={() => setImage(null)}>
                    <Icon as={<MaterialCommunityIcons name="trash-can-outline" />} size={30} color="white" />
                  </Pressable>
                </Box>
              </Box>
            ) : null}

            {/* <FormControl.ErrorMessage>{formik.errors.content}</FormControl.ErrorMessage> */}

            <Flex
              p={2}
              top={220}
              left={0}
              width="full"
              position="absolute"
              flexDir="row"
              justifyContent="space-between"
            >
              <Flex gap={1} flexDir="row">
                {/* <Switch onValueChange={announcementToggleHandler} value={selectedOption === "Announcement"} size="md" /> */}
                <Pressable
                  background="#377893"
                  borderRadius="full"
                  padding="11px"
                  width={50}
                  height={50}
                  onPress={pickImageHandler}
                >
                  <Icon as={<MaterialCommunityIcons name="image-outline" />} size={30} color="white" />
                </Pressable>
                <Pressable
                  onPress={announcementToggleHandler}
                  background={isPressed ? "orange.800" : "#377893"}
                  borderRadius="full"
                  padding="11px"
                  width={50}
                  height={50}
                >
                  <Icon as={<MaterialIcons name="campaign" />} size={30} color="white" />
                </Pressable>
                {dateShown ? (
                  <Pressable background="#377893" borderRadius="full" padding="11px" width={50} height={50}>
                    <CustomDateTimePicker
                      defaultValue={formik.values.end_date}
                      onChange={endDateAnnouncementHandler}
                      // withIcon={true}
                      // iconName="calendar-month-outline"
                      // iconType={MaterialCommunityIcons}
                    />
                  </Pressable>
                ) : null}
              </Flex>

              <Pressable
                background="#377893"
                borderRadius="full"
                padding="10px"
                width={50}
                height={50}
                onPress={formik.handleSubmit}
              >
                <Icon as={<SimpleLineIcons name="paper-plane" />} size={30} color="white" />
              </Pressable>
            </Flex>
          </FormControl>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewFeedSlider;
