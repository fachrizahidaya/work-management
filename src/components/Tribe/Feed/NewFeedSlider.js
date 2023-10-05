import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";

import { Dimensions } from "react-native";
import {
  Box,
  Flex,
  Icon,
  Pressable,
  Text,
  FormControl,
  useToast,
  Image,
  Button,
  TextArea,
  Actionsheet,
} from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { SuccessToast } from "../../shared/ToastDialog";
import axiosInstance from "../../../config/api";
import PageHeader from "../../shared/PageHeader";

const NewFeedSlider = ({ refetch, toggleNewFeed, loggedEmployeeImage, loggedEmployeeName }) => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");

  const { isOpen: postTypeIsOpen, close: postTypeIsClose, toggle: togglePostType } = useDisclosure();
  const { width, height } = Dimensions.get("window");

  const toast = useToast();

  /**
   * Submit a Post Handler
   * @param {*} form
   */
  const postSubmitHandler = async (form) => {
    try {
      await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      toggleNewFeed();
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

  /**
   * Handler for date
   */
  const [dateShown, setDateShown] = useState(false);
  const announcementToggleHandler = () => {
    setSelectedOption("Announcement");
    formik.setFieldValue("type", "Announcement");
    setDateShown(true);
    setIsAnnouncementSelected(true);
  };

  /**
   * Toggle to Public Handler
   */

  const publicToggleHandler = () => {
    setSelectedOption("Public");
    formik.setFieldValue("type", "Public");
    formik.setFieldValue("end_date", "");
    setDateShown(false);
    setIsAnnouncementSelected(false);
    togglePostType();
  };

  /**
   * Pick an image Handler
   */
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
      <Box w={width} height={height} bgColor="#FFFFFF" p={5}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between">
          <PageHeader
            title="New Post"
            onPress={() => {
              toggleNewFeed();
              setImage(null);
            }}
          />
          <Button
            size="sm"
            borderRadius="full"
            opacity={formik.values.content === "" ? 0.5 : 1}
            onPress={formik.handleSubmit}
          >
            {formik.values.type === "Public" ? "Post" : "Announce"}
          </Button>
        </Flex>

        <Flex mt={22} mx={2} gap={2} flexDir="row" alignItems="center">
          <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="md" />
          <Flex gap={1}>
            <Button height={25} onPress={() => togglePostType()} borderRadius="full" variant="outline">
              <Flex alignItems="center" flexDir="row">
                <Text fontSize={10}>{formik.values.type}</Text>
                <Icon as={<MaterialCommunityIcons name="chevron-down" />} />
              </Flex>
            </Button>
            {formik.values.type === "Public" ? (
              ""
            ) : (
              <Flex alignItems="center" gap={2} flexDir="row">
                <Icon as={<MaterialCommunityIcons name="clock-time-three-outline" />} />
                <Text fontSize={12}>
                  {!formik.values.end_date ? "Please select" : dayjs(formik.values.end_date).format("YYYY-MM-DD")}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex mt={3}>
          <FormControl isInvalid={formik.errors.content}>
            <TextArea
              minH={100}
              maxH={500}
              variant="unstyled"
              placeholder="What is happening?"
              multiline
              onChangeText={(value) => formik.setFieldValue("content", value)}
              value={formik.values.content}
              fontSize="lg"
            />

            <Flex p={2} flexDir="column" justifyContent="space-between">
              {image ? (
                image.size >= 1000000 ? (
                  <Text textAlign="center">Image size is too large!</Text>
                ) : (
                  <Box alignSelf="center">
                    <Image
                      source={{ uri: image.uri }}
                      style={{ width: 300, height: 250, borderRadius: 15 }}
                      alt="image selected"
                    />
                    <Box
                      backgroundColor="#4b4f53"
                      borderRadius="full"
                      width={8}
                      height={8}
                      top={1}
                      padding={1.5}
                      right={1}
                      position="absolute"
                    >
                      <Pressable onPress={() => setImage(null)}>
                        <Icon as={<MaterialCommunityIcons name="close" />} size={5} color="#FFFFFF" />
                      </Pressable>
                    </Box>
                  </Box>
                )
              ) : null}
            </Flex>
            <Flex gap={1} my={2} pt={2} flexDir="row">
              <Pressable padding={11} width={50} height={50} onPress={pickImageHandler}>
                <Icon as={<MaterialCommunityIcons name="image-outline" />} size={30} color="#377893" />
              </Pressable>
            </Flex>

            <Actionsheet isOpen={postTypeIsOpen} onClose={postTypeIsClose} size="full">
              <Actionsheet.Content>
                <Flex w="100%" h={30} px={4} flexDir="row">
                  <Text>Choose Post Type</Text>
                </Flex>
                <Actionsheet.Item
                  onPress={publicToggleHandler}
                  startIcon={<Icon as={<MaterialIcons name="people" />} size={6} />}
                >
                  <Flex flex={1} w="70.6%" alignItems="center" justifyContent="space-between" flexDir="row">
                    Public
                    {formik.values.type === "Public" ? <Icon as={<MaterialCommunityIcons name="check" />} /> : ""}
                  </Flex>
                </Actionsheet.Item>
                <Actionsheet.Item
                  onPress={() => {
                    announcementToggleHandler();
                  }}
                  startIcon={<Icon as={<MaterialIcons name="campaign" />} size={6} />}
                >
                  <Flex flex={1} w="85%" alignItems="center" justifyContent="space-between" flexDir="row">
                    <Box>
                      <Text>Announcement</Text>
                      <Flex gap={2} alignItems="center" flexDir="row">
                        <Text fontSize={12} fontWeight={400}>
                          End Date must be provided
                        </Text>
                        {isAnnouncementSelected && dateShown ? (
                          <CustomDateTimePicker
                            defaultValue={formik.values.end_date}
                            onChange={endDateAnnouncementHandler}
                            withText={true}
                            textLabel="Adjust date"
                            fontSize={12}
                          />
                        ) : null}
                      </Flex>
                    </Box>
                    {formik.values.type === "Announcement" ? <Icon as={<MaterialIcons name="check" />} /> : ""}
                  </Flex>
                </Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>
          </FormControl>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewFeedSlider;
