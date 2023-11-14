import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { Box, Flex, FormControl, Image, Input, Text, Pressable, Icon, useToast } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../../components/shared/FormButton";
import { ErrorToast, SuccessToast } from "../../../components/shared/ToastDialog";
import { update_image } from "../../../redux/reducer/auth";
import { update_profile } from "../../../redux/reducer/auth";
import axiosInstance from "../../../config/api";

const MyProfileScreen = ({ route }) => {
  const [image, setImage] = useState(null);

  const { profile } = route.params;

  const userSelector = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const toast = useToast();

  const phoneNumber = profile?.data?.phone_number.toString();

  const forms = [
    { title: "Email", source: profile?.data?.email },
    { title: "Date of Birth", source: profile?.data?.birthdate_convert },
    { title: "Job Title", source: profile?.data?.position_name },
    { title: "Status", source: profile?.data?.status.charAt(0).toUpperCase() + profile?.data?.status.slice(1) },
  ];

  /**
   * Submit updated profile (name) handler
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const editProfileHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/setting/users/${userSelector.id}`, { ...form, password: "" });
      dispatch(update_profile(res.data.data));
      navigation.goBack({ profile: profile });
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Profile Updated"} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={`Update Failed`} close={() => toast.close(id)} />;
        },
      });
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * Edit profile handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userSelector.name,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      editProfileHandler(values, setSubmitting, setStatus);
    },
  });

  /**
   * Pick image handler
   * @returns
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

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (fileInfo.size >= 1000000) {
      toast.show({ description: "Image size is too large" });
      return;
    }

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

  /**
   * Submit update profile picture handler
   */
  const editProfilePictureHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("_method", "PATCH");
      const res = await axiosInstance.post(`/setting/users/change-image/${userSelector.id}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      dispatch(update_image(res.data.data));
      setImage(null);
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Profile Picture Updated"} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Update failed, please try again later..."} close={() => toast.close(id)} />;
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Pressable
            onPress={() =>
              !formik.isSubmitting &&
              formik.status !== "processing" &&
              navigation.goBack({ profile: profile, editProfileHandler: editProfileHandler })
            }
          >
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text fontSize={16}>My Profile Screen</Text>
        </Flex>
      </Flex>

      <ScrollView>
        <Flex alignItems="center" justifyContent="center" gap={2} my={3}>
          <Box borderStyle="dashed" borderColor="#C6C9CC" borderRadius={20} padding={2} borderWidth={1}>
            <Image
              source={{
                uri: !image ? `${process.env.EXPO_PUBLIC_API}/image/${userSelector?.image}` : image.uri,
              }}
              resizeMethod="contain"
              borderRadius={20}
              w={120}
              h={120}
              alt="profile picture"
            />
            <Pressable
              style={styles.editPicture}
              shadow="0"
              borderRadius="full"
              borderWidth={1}
              borderColor="#C6C9CC"
              onPress={!image ? pickImageHandler : () => setImage(null)}
            >
              <Icon
                as={<MaterialCommunityIcons name={!image ? "pencil-outline" : "close"} />}
                size={5}
                color="#3F434A"
              />
            </Pressable>
          </Box>
          {image && <FormButton onPress={editProfilePictureHandler} children="Save" />}
        </Flex>

        <Flex my={3} gap={11} px={5}>
          <FormControl isInvalid={formik.errors.name}>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              type="text"
              value={formik.values.name}
              onChangeText={(value) => formik.setFieldValue("name", value)}
              defaultValue={profile?.data?.name.length > 30 ? profile?.data?.name.split(" ")[0] : profile?.data?.name}
            />
            <FormControl.ErrorMessage>{formik.errors.name}</FormControl.ErrorMessage>
          </FormControl>

          {forms.map((form) => {
            return (
              <FormControl>
                <FormControl.Label>{form.title}</FormControl.Label>
                <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
                  <Text fontSize={12} fontWeight={400} color="gray.400">
                    {form.source}
                  </Text>
                </Box>
              </FormControl>
            );
          })}

          <FormControl>
            <FormControl.Label>Phone Number</FormControl.Label>

            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                +62 {phoneNumber}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Address</FormControl.Label>

            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.address}
              </Text>
            </Box>
          </FormControl>

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text color="#FFFFFF">Save</Text>
          </FormButton>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    top: -5,
    right: -10,
    zIndex: 2,
  },
});
