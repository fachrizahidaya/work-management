import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-root-toast";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import Input from "../../../components/shared/Forms/Input";
import PageHeader from "../../../components/shared/PageHeader";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";

const GroupFormScreen = ({ route }) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const navigation = useNavigation();
  const { userArray, groupData } = route.params;
  const [image, setImage] = useState(null);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const createGroupHandler = async (form, setSubmitting) => {
    try {
      const res = await axiosInstance.post("/chat/group", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setSelectedGroupMembers(userArray);

      navigation.navigate("Chat Room", {
        name: res.data.data.name,
        userId: res.data.data.id,
        image: res.data.data.image,
        type: "group",
        position: null,
        email: null,
        active_member: 1,
        roomId: res.data.data.id,
      });
      setSubmitting(false);
      Toast.show("Group created!", SuccessToastProps);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      Toast.show(error.rersponse.data.message, ErrorToastProps);
    }
  };

  const formik = useFormik({
    enableReinitialize: groupData ? true : false,
    initialValues: {
      name: groupData?.name || "",
      image: groupData?.image || "",
      member: userArray,
    },
    validationSchema: yup.object().shape({
      name: yup.string().max(30, "30 characters maximum").required("Group name is required"),
    }),
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();

      for (let prop in values) {
        if (Array.isArray(values[prop])) {
          values[prop].forEach((item, index) => {
            Object.keys(item).forEach((key) => {
              formData.append(`${prop}[${index}][${key}]`, item[key]);
            });
          });
        } else {
          formData.append(prop, values[prop]);
        }
      }
      createGroupHandler(formData, setSubmitting);
    },
  });

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
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
    <SafeAreaView style={styles.container}>
      <Pressable style={{ flex: 1, display: "flex", gap: 10, paddingHorizontal: 20 }} onPress={Keyboard.dismiss}>
        <PageHeader title="New Group" onPress={() => !formik.isSubmitting && navigation.goBack()} />

        <Text style={[{ fontSize: 12 }, TextProps]}>Participants: {userArray?.length}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
          {userArray?.length > 0 &&
            userArray.map((user) => {
              return (
                <View key={user.id} style={{ alignItems: "center" }}>
                  <AvatarPlaceholder name={user.name} image={user.image} isThumb={false} size="md" />
                  <Text style={[{ fontSize: 12 }, TextProps]}>
                    {user.name.length > 8 ? user.name.slice(0, 8) + "..." : user.name}
                  </Text>
                </View>
              );
            })}
        </View>
        <View style={{ alignItems: "center", gap: 20 }}>
          <TouchableOpacity style={styles.groupImage} onPress={pickImageHandler}>
            {image ? (
              <Image
                style={{ height: 150, width: 150, borderRadius: 80 }}
                alt="group-image"
                source={{ uri: image.uri }}
              />
            ) : (
              <View style={{ alignItems: "center", gap: 5 }}>
                <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF" }}>Add group icon</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            width={380}
            placeHolder="Group name"
            value={formik.values.name}
            onChangeText={(value) => formik.setFieldValue("name", value)}
          />
          {formik.errors.name && <Text style={{ fontSize: 12, color: "#F44336" }}>{formik.errors.name}</Text>}

          <Pressable
            style={{
              backgroundColor: formik.isSubmitting ? "#757575" : "#176688",
              padding: 20,
              shadowOffset: 0,
              borderWidth: 5,
              borderColor: "#FFFFFF",
              borderRadius: 40,
            }}
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <MaterialCommunityIcons name="check" size={25} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default GroupFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  groupImage: {
    borderRadius: 80,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176688",
  },
});
