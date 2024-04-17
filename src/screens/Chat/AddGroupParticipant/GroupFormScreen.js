import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, SafeAreaView, StyleSheet, View, Text, Pressable, Alert } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import SelectedUserList from "../../../components/Chat/UserSelection/SelectedUserList";
import GroupData from "../../../components/Chat/UserSelection/GroupData";
import { pickImageHandler } from "../../../components/shared/PickImage";

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

        <GroupData pickImageHandler={pickImageHandler} image={image} formik={formik} setImage={setImage} />
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
