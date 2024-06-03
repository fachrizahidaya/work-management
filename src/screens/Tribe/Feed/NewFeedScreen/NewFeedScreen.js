import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useSelector } from "react-redux";

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
import PostOptions from "../../../../components/Tribe/Feed/NewFeed/PostOptions";
import PickImage from "../../../../components/shared/PickImage";
import { useLoading } from "../../../../hooks/useLoading";

const NewFeedScreen = () => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");
  const [isReady, setIsReady] = useState(false);
  const [dateShown, setDateShown] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const postActionScreenSheetRef = useRef(null);

  const { loggedEmployeeImage, loggedEmployeeName, handleAfterNewPost } = route.params;

  const menuSelector = useSelector((state) => state.user_menu.user_menu.menu);

  const checkAccess = menuSelector[1].sub[2].actions.create_announcement;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);
  const { isOpen: addImageModalIsOpen, toggle: toggleAddImageModal } = useDisclosure(false);

  const { toggle: toggleProcess, isLoading: processIsLoading } = useLoading(false);

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
      handleAfterNewPost();
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

  const submitNewPost = () => {
    toggleProcess();
    formik.handleSubmit();
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <NewFeedForm
                formik={formik}
                image={image}
                setImage={setImage}
                employees={employees?.data}
                isLoading={processIsLoading}
                setIsLoading={toggleProcess}
                handleAddImageOption={toggleAddImageModal}
                onSubmit={submitNewPost}
              />
              <PostTypeOptions
                onTogglePublic={publicToggleHandler}
                onToggleAnnouncement={announcementToggleHandler}
                isAnnouncementSelected={isAnnouncementSelected}
                dateShown={dateShown}
                handleEndDataOfAnnouncement={endDateAnnouncementHandler}
                formik={formik}
                reference={postActionScreenSheetRef}
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
              <PickImage setImage={setImage} modalIsOpen={addImageModalIsOpen} toggleModal={toggleAddImageModal} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
