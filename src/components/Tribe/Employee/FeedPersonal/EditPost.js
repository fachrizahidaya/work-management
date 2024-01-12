import React from "react";
import { Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";

const EditPost = () => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return <Modal deviceHeight={deviceHeight} deviceWidth={deviceWidth}></Modal>;
};

export default EditPost;
