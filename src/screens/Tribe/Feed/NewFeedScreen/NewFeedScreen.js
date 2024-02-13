import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text, ScrollView } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../components/shared/AvatarPlaceholder";
import Button from "../../../../components/shared/Forms/Button";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import PageHeader from "../../../../components/shared/PageHeader";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import NewFeedForm from "../../../../components/Tribe/Feed/NewFeed/NewFeedForm";
import PostAction from "../../../../components/Tribe/Feed/NewFeed/PostAction";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";

const NewFeedScreen = () => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");
  const [isReady, setIsReady] = useState(false);
  const [dateShown, setDateShown] = useState(false);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const postActionScreenSheetRef = useRef(null);

  const menuSelector = useSelector((state) => state.user_menu.user_menu.menu);

  const checkAccess = menuSelector[1].sub[2].actions.create_announcement;

  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const route = useRoute();

  const { loggedEmployeeImage, loggedEmployeeName, postRefetchHandler, scrollNewMessage, setScrollNewMessage } =
    route.params;

  const { data: employees, isFetching: employeesIsFetching, refetch: refetchEmployees } = useFetch("/hr/employees");

  /**
   * Submit a post handler
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
      setScrollNewMessage(!scrollNewMessage);
      postRefetchHandler();
      Toast.show("Posted successfully!", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * End date of announcement handler
   * @param {*} value
   */
  const endDateAnnouncementHandler = (value) => {
    formik.setFieldValue("end_date", value);
  };

  /**
   * Date for announcement handler
   */
  const announcementToggleHandler = () => {
    setDateShown(true);
    setIsAnnouncementSelected(true);
    setSelectedOption("Announcement");
    formik.setFieldValue("type", "Announcement");
  };

  /**
   * Create a new post handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      type: selectedOption || "Public",
      end_date: "",
    },
    // validationSchema: yup.object().shape({
    //   content: yup.string().required("Content is required"),
    // }),
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
   * Toggle to Public Handler
   */
  const publicToggleHandler = () => {
    setSelectedOption("Public");
    formik.setFieldValue("type", "Public");
    formik.setFieldValue("end_date", "");
    setDateShown(false);
    setIsAnnouncementSelected(false);
  };

  const mentionSelectHandler = (updatedContent) => {
    formik.setFieldValue("content", updatedContent);
  };

  /**
   * Pick an image Handler
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
          <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
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
            <View style={styles.container}>
              <View
                style={{ ...styles.inputHeader, alignItems: formik.values.type === "Public" ? "center" : "center" }}
              >
                <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="lg" isThumb={false} />
                <View style={{ gap: 5 }}>
                  <Button
                    disabled={checkAccess ? false : true}
                    padding={8}
                    height={32}
                    backgroundColor="#FFFFFF"
                    onPress={() => (checkAccess ? postActionScreenSheetRef.current?.show() : null)}
                    borderRadius={15}
                    variant="outline"
                    children={
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={[{ fontSize: 10 }, TextProps]}>{formik.values.type}</Text>
                        {checkAccess ? <MaterialCommunityIcons name="chevron-down" color="#3F434A" /> : null}
                      </View>
                    }
                  />
                  {formik.values.type === "Public" ? (
                    ""
                  ) : (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                      <MaterialCommunityIcons name="clock-time-three-outline" color="#3F434A" />
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        {!formik.values.end_date ? "Please select" : dayjs(formik.values.end_date).format("YYYY-MM-DD")}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <NewFeedForm
                formik={formik}
                image={image}
                setImage={setImage}
                pickImageHandler={pickImageHandler}
                employees={employees?.data}
              />
              <PostAction
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
