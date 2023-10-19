import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { Box, Flex, FormControl, Image, Input, TextArea, Text, Pressable, Icon, useToast, Button } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import FormButton from "../../components/shared/FormButton";
import { SuccessToast } from "../../components/shared/ToastDialog";
import { update_image } from "../../redux/reducer/auth";
import axiosInstance from "../../config/api";

const MyProfileScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile, editProfileHandler } = route.params;

  const userSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const toast = useToast();

  const phoneNumber = profile?.data?.phone_number.toString();

  const returnToAccount = () =>
    navigation.navigate("Account Screen", { profile: profile, editProfileHandler: editProfileHandler });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userSelector.name,
      // email: userSelector.email,
    },
    validationSchema: yup.object().shape({
      // name: yup.string().required("Name is required"),
      // email: yup.string().required("Email is required"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      editProfileHandler(values, setSubmitting);
      navigation.navigate("Account Screen", { profile: profile, editProfileHandler: editProfileHandler });
      toast.show({
        render: () => {
          return <SuccessToast message={"Profile Updated"} />;
        },
        placement: "top",
      });
    },
  });

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

  const formData = new FormData();
  formData.append("image", image?.name);
  formData.append("_method", "PATCH");

  const editProfilePictureHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.patch(`/setting/users/change-image/${userSelector.id}`, image?.name);
      dispatch(update_image(res.data.data));
      setImage(null);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Profile Screen" backButton={returnToAccount} />
      </Flex>

      <ScrollView>
        <Flex alignItems="center" justifyContent="center" gap={2} my={3}>
          <Box borderStyle="dashed" borderColor="#C6C9CC" borderRadius={20} padding={2} borderWidth={1}>
            <Image
              source={{
                uri: !image
                  ? `${process.env.EXPO_PUBLIC_API}/image/${userSelector?.image}`
                  : image.size >= 1000000
                  ? toast.show({ description: "Your image size is too large" })
                  : image.uri,
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

          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.email}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.username}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Date of Birth</FormControl.Label>
            {/* <Input
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.birthdate_convert}
            /> */}
            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.birthdate_convert}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Job Title</FormControl.Label>

            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.position_name}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Status</FormControl.Label>

            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                {profile?.data?.status.charAt(0).toUpperCase() + profile?.data?.status.slice(1)}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Phone Number</FormControl.Label>
            {/* <Input
              InputLeftElement={
                <Flex ml={2}>
                  <Text fontSize={12}>+62</Text>
                </Flex>
              }
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={phoneNumber}
            /> */}
            <Box borderRadius={15} padding={3} borderWidth={1} borderColor="gray.200">
              <Text fontSize={12} fontWeight={400} color="gray.400">
                +62 {phoneNumber}
              </Text>
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Address</FormControl.Label>
            {/* <TextArea
              type="text"
              isDisabled
              editable={false}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              defaultValue={profile?.data?.address}
            /> */}
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
