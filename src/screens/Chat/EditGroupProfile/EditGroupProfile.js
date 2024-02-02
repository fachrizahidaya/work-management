import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { useFormik } from "formik";

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import axiosInstance from "../../../config/api";
import FormButton from "../../../components/shared/FormButton";
import Input from "../../../components/shared/Forms/Input";
import { SuccessToastProps, ErrorToastProps } from "../../../components/shared/CustomStylings";

const EditGroupProfile = () => {
  const [imageAttachment, setImageAttachment] = useState(null);
  const [editName, setEditName] = useState(false);

  const navigation = useNavigation();

  const route = useRoute();

  const { name, image, roomId } = route.params;

  const editGroupNameHandler = () => {
    setEditName(!editName);
  };

  /**
   * Handle group update event
   *
   * @param {*} group_id
   * @param {*} data
   */
  const groupUpdateHandler = async (group_id, form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/chat/group/${group_id}`, form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setSubmitting(false);
      setStatus("success");
      navigation.navigate("Chat List");
      Toast.show("Group Profile updated", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

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
      // toast.show({ description: "Image size is too large" });
      Alert.alert("Image size is too large");
      return;
    }

    if (result) {
      setImageAttachment({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name || "",
      image: image || "",
      member: null,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Group name is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      formData.append("_method", "PATCH"); // if want to use PATCH method, put POST method to API then add append
      formData.append("image", imageAttachment);
      setStatus("processing");
      groupUpdateHandler(roomId, formData, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      editGroupNameHandler();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Edit Profile</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!imageAttachment ? (
                <AvatarPlaceholder size="xl" name={name} image={!imageAttachment ? image : imageAttachment.uri} />
              ) : (
                <Image
                  source={{
                    uri: `${imageAttachment?.uri}`,
                  }}
                  alt="profile picture"
                  style={{
                    width: 80,
                    height: 80,
                    resizeMode: "contain",
                    borderRadius: 40,
                  }}
                />
              )}
              <Pressable
                style={styles.editPicture}
                onPress={!imageAttachment ? pickImageHandler : () => setImageAttachment(null)}
              >
                <MaterialCommunityIcons
                  name={!imageAttachment ? "camera-outline" : "close"}
                  size={20}
                  color="#3F434A"
                />
              </Pressable>
            </View>

            {editName ? (
              <Input
                numberOfLines={2}
                value={formik.values.name}
                onChangeText={(value) => formik.setFieldValue("name", value)}
                defaultValue={name}
                endIcon="close"
                onPressEndIcon={() => {
                  editGroupNameHandler();
                  formik.setFieldValue("name", name);
                }}
              />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }} numberOfLines={2}>
                  {name}
                </Text>
                <MaterialCommunityIcons name="pencil" size={20} color="#3F434A" onPress={editGroupNameHandler} />
              </View>
            )}
          </View>
          {imageAttachment || formik.values.name !== name ? (
            <FormButton
              fontColor="white"
              onPress={formik.handleSubmit}
              children={<Text style={{ fontSize: 14, fontWeight: "400", color: "#FFFFFF" }}>Save</Text>}
            />
          ) : (
            <FormButton
              fontColor="white"
              opacity={0.5}
              onPress={null}
              children={<Text style={{ fontSize: 14, fontWeight: "400", color: "#FFFFFF" }}>Save</Text>}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditGroupProfile;

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
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#C6C9CC",
    shadowOffset: 0,
  },
});
