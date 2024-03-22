import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, SafeAreaView, StyleSheet, View, Text, Pressable, Alert } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import SelectedUserList from "../../../components/Chat/UserSelection/SelectedUserList";
import GroupData from "../../../components/Chat/UserSelection/GroupData";

const GroupFormScreen = ({ route }) => {
  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  const { userArray, groupData } = route.params;

  const createGroupHandler = async (form, setSubmitting) => {
    try {
      const res = await axiosInstance.post("/chat/group", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      navigation.navigate("Chat Room", {
        name: res.data.data.name,
        userId: res.data.data.id,
        image: res.data.data.image,
        type: "group",
        position: null,
        email: null,
        active_member: 1,
        roomId: res.data.data.id,
        forwardedMessage: null,
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
   * Handle pick an image
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

    if (fileInfo.size >= 1000000) {
      Alert.alert("File size too large");
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Pressable
          style={{
            display: "flex",
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
          onPress={Keyboard.dismiss}
        >
          <PageHeader title="New Group" onPress={() => !formik.isSubmitting && navigation.goBack()} />

          <Text style={[{ fontSize: 12, marginLeft: 25 }, TextProps]}>Participants: {userArray?.length}</Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          {userArray?.length > 0 &&
            userArray.map((user, index) => {
              return <SelectedUserList key={index} name={user?.name} id={user?.id} image={user?.image} />;
            })}
        </View>

        <GroupData pickImageHandler={pickImageHandler} image={image} formik={formik} />
      </View>
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
  groupData: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
});
