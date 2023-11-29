import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { useFormik } from "formik";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Image, Input, Pressable, Text, useToast } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import axiosInstance from "../../config/api";
import FormButton from "../../components/shared/FormButton";

const EditGroupProfile = () => {
  const [imageAttachment, setImageAttachment] = useState(null);
  const [editName, setEditName] = useState(false);

  const navigation = useNavigation();
  const toast = useToast();

  const route = useRoute();

  const { type, name, image, roomId } = route.params;

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
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message="Group Profile Updated" close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message="Process Failed, please try again later." close={() => toast.close(id)} />;
        },
      });
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
      toast.show({ description: "Image size is too large" });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => !formik.isSubmitting && formik.status !== "processing" && navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text>Edit Profile</Text>
        </Flex>
      </Flex>
      <Flex flex={1} px={4} py={2} gap={5} bg="#FFFFFF">
        <Flex gap={5} px={3} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="row" alignItems="center">
            <Box>
              {!imageAttachment ? (
                <AvatarPlaceholder size="2xl" name={name} image={!imageAttachment ? image : imageAttachment.uri} />
              ) : (
                <Image
                  source={{
                    uri: `${imageAttachment?.uri}`,
                  }}
                  resizeMode="contain"
                  borderRadius="full"
                  w={120}
                  h={120}
                  alt="profile picture"
                />
              )}
              <Pressable
                style={styles.editPicture}
                shadow="0"
                borderRadius="full"
                borderWidth={1}
                borderColor="#C6C9CC"
                onPress={!imageAttachment ? pickImageHandler : () => setImageAttachment(null)}
              >
                <Icon
                  as={<MaterialCommunityIcons name={!imageAttachment ? "camera-outline" : "close"} />}
                  size={5}
                  color="#3F434A"
                />
              </Pressable>
            </Box>
          </Flex>

          <Flex alignItems="center">
            {editName ? (
              <Flex flexDirection="row" alignItems="center">
                <Input
                  width={180}
                  numberOfLines={2}
                  type="text"
                  size="lg"
                  value={formik.values.name}
                  onChangeText={(value) => formik.setFieldValue("name", value)}
                  defaultValue={name}
                  variant="underlined"
                  InputRightElement={
                    <Icon
                      onPress={() => {
                        editGroupNameHandler();
                        formik.setFieldValue("name", name);
                      }}
                      as={<MaterialCommunityIcons name="close" />}
                    />
                  }
                />
              </Flex>
            ) : (
              <Flex flexDirection="row" alignItems="center" gap={1}>
                <Text width={150} numberOfLines={2} fontSize={16} fontWeight={500}>
                  {name}
                </Text>
                <Icon
                  onPress={editGroupNameHandler}
                  as={<MaterialCommunityIcons name="pencil" />}
                  size={5}
                  color="#3F434A"
                />
              </Flex>
            )}
          </Flex>
        </Flex>
        {imageAttachment || formik.values.name !== name ? (
          <FormButton onPress={formik.handleSubmit} children="Save" />
        ) : (
          <FormButton opacity={0.5} onPress={null} children="Save" />
        )}
      </Flex>
    </SafeAreaView>
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
  },
});
