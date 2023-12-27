import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { Icon } from "native-base";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text } from "react-native";
import Toast from "react-native-toast-message";

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

const NewFeedScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");
  const [isReady, setIsReady] = useState(false);

  const { isOpen: postTypeIsOpen, close: postTypeIsClose, toggle: togglePostType } = useDisclosure(false);
  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const postActionScreenSheetRef = useRef(null);

  const menuSelector = useSelector((state) => state.user_menu.user_menu.menu);

  const checkAccess = menuSelector[1].sub[2].actions.create_announcement;

  const navigation = useNavigation();

  const inputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const {
    loggedEmployeeImage,
    loggedEmployeeName,
    loggedEmployeeDivision,
    postRefetchHandler,
    scrollNewMessage,
    setScrollNewMessage,
  } = route.params;

  const { data: employees, isFetching: employeesIsFetching, refetch: refetchEmployees } = useFetch("/hr/employees");

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
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
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
      postRefetchHandler();
      setScrollNewMessage(!scrollNewMessage);
      setSubmitting(false);
      setStatus("success");

      Toast.show({
        type: "success",
        text1: "Posted successfully!",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
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
  const [dateShown, setDateShown] = useState(false);
  const announcementToggleHandler = () => {
    setDateShown(true);
    setIsAnnouncementSelected(true);
    setSelectedOption("Announcement");
    formik.setFieldValue("type", "Announcement");
  };

  /**
   * Toggle to Public Handler
   */
  const publicToggleHandler = () => {
    setSelectedOption("Public");
    formik.setFieldValue("type", "Public");
    formik.setFieldValue("end_date", "");
    setDateShown(false);
    setIsAnnouncementSelected(false);
    togglePostType();
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
      aspect: [4, 3],
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
          <View style={styles.container}>
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

            <View style={{ ...styles.inputHeader, alignItems: formik.values.type === "Public" ? null : "center" }}>
              <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="md" isThumb={false} />
              <View style={{ gap: 5 }}>
                <Button
                  disabled={checkAccess ? false : true}
                  padding={10}
                  height={30}
                  backgroundColor="#FFFFFF"
                  onPress={() => postActionScreenSheetRef.current?.show()}
                  borderRadius={15}
                  variant="outline"
                  children={
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 10 }}>{formik.values.type}</Text>
                      {checkAccess ? <Icon as={<MaterialCommunityIcons name="chevron-down" />} /> : null}
                    </View>
                  }
                />
                {formik.values.type === "Public" ? (
                  ""
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <MaterialCommunityIcons name="clock-time-three-outline" />
                    <Text style={{ fontSize: 12 }}>
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
              postTypeIsOpen={postTypeIsOpen}
              postTypeIsClose={postTypeIsClose}
              publicToggleHandler={publicToggleHandler}
              announcementToggleHandler={announcementToggleHandler}
              isAnnouncementSelected={isAnnouncementSelected}
              dateShown={dateShown}
              endDateAnnouncementHandler={endDateAnnouncementHandler}
              loggedEmployeeDivision={loggedEmployeeDivision}
              employees={employees?.data}
              mentionSelectHandler={mentionSelectHandler}
              inputRef={inputRef}
            />
            <PostAction
              publicToggleHandler={publicToggleHandler}
              postTypeIsOpen={postTypeIsOpen}
              postTypeIsClose={postTypeIsClose}
              announcementToggleHandler={announcementToggleHandler}
              isAnnouncementSelected={isAnnouncementSelected}
              dateShown={dateShown}
              endDateAnnouncementHandler={endDateAnnouncementHandler}
              formik={formik}
              reference={postActionScreenSheetRef}
            />
          </View>
        ) : (
          <></> // handle if screen not ready
        )}
      </TouchableWithoutFeedback>
      <Toast />
    </>
  );
};

export default NewFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  inputHeader: {
    flexDirection: "row",

    gap: 5,
    marginHorizontal: 2,
    marginTop: 22,
  },
});
