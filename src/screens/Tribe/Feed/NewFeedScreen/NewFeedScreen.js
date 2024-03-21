NewFeedScreen;
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, ScrollView } from "react-native";
import Toast from "react-native-root-toast";

import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import PageHeader from "../../../../components/shared/PageHeader";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import NewFeedForm from "../../../../components/Tribe/Feed/NewFeed/NewFeedForm";
import PostTypeOptions from "../../../../components/Tribe/Feed/NewFeed/PostTypeOptions";
import { ErrorToastProps } from "../../../../components/shared/CustomStylings";
import PostOptions from "./PostOptions";

const NewFeedScreen = () => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");
  const [isReady, setIsReady] = useState(false);
  const [dateShown, setDateShown] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const postActionScreenSheetRef = useRef(null);

  const { loggedEmployeeImage, loggedEmployeeName, postRefetchHandler, toggleSuccess, setRequestType } = route.params;

  const menuSelector = useSelector((state) => state.user_menu.user_menu.menu);
  const checkAccess = menuSelector[1].sub[2].actions.create_announcement;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  // Handle close keyboard after input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { data: employees } = useFetch("/hr/employees");

  /**
   * Handle submit post
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const postSubmitHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setSubmitting(false);
      setStatus("success");
      postRefetchHandler();
      toggleSuccess();
      setRequestType("post");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle toggle Announcement
   */
  const announcementToggleHandler = () => {
    setDateShown(true);
    setIsAnnouncementSelected(true);
    setSelectedOption("Announcement");
    formik.setFieldValue("type", "Announcement");
  };

  /**
   * Handle toggle Public
   */
  const publicToggleHandler = () => {
    setSelectedOption("Public");
    formik.setFieldValue("type", "Public");
    formik.setFieldValue("end_date", "");
    setDateShown(false);
    setIsAnnouncementSelected(false);
  };

  /**
   * Handle end date of announcement
   * @param {*} value
   */
  const endDateAnnouncementHandler = (value) => {
    formik.setFieldValue("end_date", value);
  };

  /**
   * Handle create new post
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      type: selectedOption || "Public",
      end_date: "",
    },
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const formData = new FormData();
      for (let key in values) {
        if (key === "content") {
          const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
          const modifiedContent = values[key].replace(mentionRegex, "@$1");
          formData.append(key, modifiedContent);
        } else {
          formData.append(key, values[key]);
        }
      }
      formData.append("file", image);

      if (values.type === "Public") {
        postSubmitHandler(formData, setSubmitting, setStatus);
      } else {
        if (values.end_date) {
          postSubmitHandler(formData, setSubmitting, setStatus);
        } else {
          throw new Error("For Announcement type, end date is required");
        }
      }
    },
  });

  /**
   * Handle pick an image attachment
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

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

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        {isReady ? (
          <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#FFFFFF" }}>
            <View style={styles.header}>
              <PageHeader
                title="New Post"
                onPress={
                  formik.values.content || image !== null
                    ? !formik.isSubmitting && formik.status !== "processing" && toggleReturnModal
                    : () => {
                        !formik.isSubmitting && formik.status !== "processing" && navigation.goBack();
                        formik.resetForm();
                        setImage(null);
                      }
                }
              />
            </View>

            <View style={styles.container}>
              <PostOptions
                formik={formik}
                loggedEmployeeImage={loggedEmployeeImage}
                loggedEmployeeName={loggedEmployeeName}
                reference={postActionScreenSheetRef}
                checkAccess={checkAccess}
              />

              <ReturnConfirmationModal
                isOpen={returnModalIsOpen}
                toggle={toggleReturnModal}
                onPress={() => {
                  toggleReturnModal();
                  navigation.goBack();
                  setImage(null);
                }}
                description="Are you sure want to exit? It will be deleted."
              />

              <NewFeedForm
                formik={formik}
                image={image}
                setImage={setImage}
                pickImageHandler={pickImageHandler}
                employees={employees?.data}
              />
              <PostTypeOptions
                publicToggleHandler={publicToggleHandler}
                announcementToggleHandler={announcementToggleHandler}
                isAnnouncementSelected={isAnnouncementSelected}
                dateShown={dateShown}
                endDateAnnouncementHandler={endDateAnnouncementHandler}
                formik={formik}
                reference={postActionScreenSheetRef}
              />
            </View>
          </ScrollView>
        ) : (
          <></> // handle if screen not ready
        )}
      </TouchableWithoutFeedback>
    </>
  );
};

export default NewFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  inputHeader: {
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 2,
    marginTop: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
