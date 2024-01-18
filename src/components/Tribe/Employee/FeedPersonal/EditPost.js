import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NewFeedInput from "../../Feed/NewFeed/NewFeedInput";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import Button from "../../../shared/Forms/Button";
import { TextProps } from "../../../shared/CustomStylings";
import PostAction from "../../Feed/NewFeed/PostAction";

const EditPost = ({
  isVisible,
  onBackdrop,
  employees,
  content,
  image,
  setImage,
  pickImageHandler,
  postEditHandler,
  isLoading,
  setIsLoading,
  checkAccess,
}) => {
  const [imagePreview, setImagePreview] = useState("");
  const [dateShown, setDateShown] = useState(false);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");

  const postActionScreenSheetRef = useRef(null);

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: content?.content || "",
      type: content?.type || selectedOption,
      end_date: content?.end_date || "",
      file_name: content?.file_name || "",
    },
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const formData = new FormData();
      for (let key in values) {
        if (key === "content") {
          const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
          const modifiedContent = values[key]?.replace(mentionRegex, "@$1");
          formData.append(key, modifiedContent);
        } else {
          formData.append(key, values[key]);
        }
      }
      formData.append("_method", "PATCH");
      formData.append("file_name", values.file_name);
      formData.append("file", image);

      if (values.type === "Public") {
        postEditHandler(formData, setSubmitting, setStatus);
      } else {
        if (values.end_date) {
          postEditHandler(formData, setSubmitting, setStatus);
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
   * Handle image preview removal
   */
  const imagePreviewRemoveHandler = () => {
    setImagePreview(null);
    formik.setFieldValue("file", "");
    formik.setFieldValue("file_name", "");
  };

  useEffect(() => {
    if (content?.file_path) {
      setImagePreview(content?.file_path || "");
    }
  }, [content]);

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => {
          onBackdrop();
          setImagePreview(content?.file_path);
        }}
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              display: "flex",
              gap: 10,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: formik.values.type === "Public" ? null : "center", gap: 5 }}
            >
              <AvatarPlaceholder
                image={content?.employee_image}
                name={content?.employee_name}
                size="lg"
                isThumb={false}
              />
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
                    <Text style={[{ fontSize: 10 }, TextProps]}>
                      {!formik.values.end_date ? "Please select" : dayjs(formik.values.end_date).format("YYYY-MM-DD")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.container}>
              <NewFeedInput formik={formik} employees={employees} />
              <View style={styles.boxImage}>
                {imagePreview ? (
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${imagePreview}` }}
                      style={styles.image}
                      alt="image selected"
                    />
                    <Pressable style={styles.close} onPress={() => imagePreviewRemoveHandler()}>
                      <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ) : image ? (
                  <View style={{ alignSelf: "center" }}>
                    <Image source={{ uri: image.uri }} style={styles.image} alt="image selected" />
                    <Pressable style={styles.close} onPress={() => setImage(null)}>
                      <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ) : null}
              </View>
              <View style={styles.action}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Pressable onPress={pickImageHandler}>
                    <MaterialCommunityIcons
                      name="attachment"
                      size={25}
                      color="#3F434A"
                      style={{ transform: [{ rotate: "-35deg" }] }}
                    />
                  </Pressable>
                </View>

                <Pressable
                  style={{ ...styles.submit }}
                  onPress={
                    formik.values.content === ""
                      ? null
                      : () => {
                          setIsLoading(true);
                          formik.handleSubmit();
                        }
                  }
                  disabled={formik.values.content === "" ? true : false}
                >
                  {isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <MaterialCommunityIcons
                      name={formik.values.type === "Public" ? "send" : "bullhorn-variant"}
                      size={25}
                      color="#FFFFFF"
                      style={{ transform: [{ rotate: "-45deg" }] }}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <PostAction
        publicToggleHandler={publicToggleHandler}
        announcementToggleHandler={announcementToggleHandler}
        isAnnouncementSelected={isAnnouncementSelected}
        dateShown={dateShown}
        endDateAnnouncementHandler={endDateAnnouncementHandler}
        formik={formik}
        reference={postActionScreenSheetRef}
      />
    </>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dfdfdf",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 30,
    backgroundColor: "#4b4f53",
  },
  submit: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#377893",
    width: 50,
    height: 50,
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  boxImage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: 300,
    height: 250,
    borderRadius: 10,
  },
});
