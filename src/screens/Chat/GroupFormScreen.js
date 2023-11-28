import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useFormik } from "formik";
import * as yup from "yup";

import { Keyboard, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { HStack, Icon, Image, Input, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import PageHeader from "../../components/shared/PageHeader";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import axiosInstance from "../../config/api";

const GroupFormScreen = ({ route }) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const toast = useToast();
  const navigation = useNavigation();
  const { userArray, groupData, forceRender, setForceRender } = route.params;
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
        forceRender: forceRender,
        setForceRender: setForceRender,
        selectedGroupMembers: userArray,
      });
      setSubmitting(false);
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group created!" close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
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
      <Pressable flex={1} display="flex" paddingHorizontal={16} gap={8} onPress={Keyboard.dismiss} accessible={false}>
        <PageHeader title="New Group" onPress={() => !formik.isSubmitting && navigation.goBack()} />

        <HStack alignItems="center" space={2}>
          <TouchableOpacity style={styles.groupImage} onPress={pickImageHandler}>
            {image ? (
              <Image rounded="full" alt="group-image" source={{ uri: image.uri }} h={50} w={50} />
            ) : (
              <Icon as={<MaterialCommunityIcons name="camera" />} size="lg" color="white" />
            )}
          </TouchableOpacity>

          <VStack flex={1}>
            <Input
              autoCapitalize="words"
              isInvalid={formik.errors.name}
              flex={1}
              variant="underlined"
              placeholder="Group name"
              size="lg"
              value={formik.values.name}
              onChangeText={(value) => formik.setFieldValue("name", value)}
            />
            {formik.errors.name && (
              <Text color="red.500" fontSize={12}>
                {formik.errors.name}
              </Text>
            )}
          </VStack>
        </HStack>

        <Text>Participants: {userArray?.length}</Text>
        <HStack space={2} flexWrap="wrap">
          {userArray?.length > 0 &&
            userArray.map((user) => {
              return (
                <VStack key={user.id} alignItems="center">
                  <AvatarPlaceholder name={user.name} image={user.image} isThumb={false} size="md" />
                  <Text fontSize={12}>{user.name.length > 8 ? user.name.slice(0, 8) + "..." : user.name}</Text>
                </VStack>
              );
            })}
        </HStack>
      </Pressable>

      <Pressable
        position="absolute"
        right={5}
        bottom={isKeyboardVisible ? keyboardHeight + 20 : 20}
        rounded="full"
        bgColor={formik.isSubmitting ? "coolGray.500" : "primary.600"}
        p={15}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <Spinner color="white" size="lg" />
        ) : (
          <Icon as={<MaterialCommunityIcons name="check" />} size="xl" color="white" />
        )}
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
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176688",
  },
});
