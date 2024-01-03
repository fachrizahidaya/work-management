import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../../components/shared/FormButton";
import { update_image } from "../../../redux/reducer/auth";
import { update_profile } from "../../../redux/reducer/auth";
import axiosInstance from "../../../config/api";
import PageHeader from "../../../components/shared/PageHeader";
import Input from "../../../components/shared/Forms/Input";

const MyProfileScreen = ({ route }) => {
  const [image, setImage] = useState(null);

  const { profile } = route.params;

  const userSelector = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigation = useNavigation();

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
      Toast.show({
        type: "success",
        text1: "Profile updated!",
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (fileInfo.size >= 1000000) {
      Toast.show({
        type: "error",
        text1: "File size is too large!",
      });
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
      Toast.show({
        type: "success",
        text1: "Profile picture updated!",
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          paddingVertical: 14,
          paddingHorizontal: 16,
        }}
      >
        <PageHeader
          title="My Profile Screen"
          onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack({ profile })}
        />
      </View>

      <ScrollView
        style={{
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginVertical: 3,
          }}
        >
          <View style={{ borderStyle: "dashed", borderColor: "#C6C9CC", borderRadius: 20, padding: 2, borderWidth: 1 }}>
            <Image
              style={{ resizeMode: "contain", borderRadius: 20, width: 120, height: 120 }}
              source={{
                uri: !image ? `${process.env.EXPO_PUBLIC_API}/image/${userSelector?.image}` : image.uri,
              }}
              alt="profile picture"
            />
            <Pressable style={styles.editPicture} onPress={!image ? pickImageHandler : () => setImage(null)}>
              <MaterialCommunityIcons name={!image ? "pencil-outline" : "close"} size={20} />
            </Pressable>
          </View>
          {image && (
            <FormButton onPress={editProfilePictureHandler} style={{ paddingHorizontal: 8 }}>
              <Text style={{ color: "white" }}>Save</Text>
            </FormButton>
          )}
        </View>

        <View
          style={{
            display: "flex",
            gap: 20,
            marginVertical: 3,
            paddingHorizontal: 5,
          }}
        >
          <Input
            title="Name"
            formik={formik}
            value={formik.values.name}
            fieldName="name"
            defaultValue={profile?.data?.name.length > 30 ? profile?.data?.name.split(" ")[0] : profile?.data?.name}
          />

          {forms.map((form) => {
            return <Input key={form.title} title={form.title} editable={false} defaultValue={form.source} />;
          })}

          <Input title="Phone Number" editable={false} defaultValue={`+62 ${phoneNumber}`} />

          <Input title="Address" editable={false} defaultValue={profile?.data?.address} multiline />

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text style={{ color: "white" }}>Save</Text>
          </FormButton>
        </View>
      </ScrollView>

      <Toast position="bottom" />
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
    // shadow="0"
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#C6C9CC",
  },
});
