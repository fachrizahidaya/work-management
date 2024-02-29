import { memo } from "react";

import Toast from "react-native-root-toast";

import { ActivityIndicator, Dimensions, Image, Platform, Text, View } from "react-native";
import Modal from "react-native-modal";

import axiosInstance from "../../config/api";
import { useLoading } from "../../hooks/useLoading";
import Button from "./Forms/Button";
import { ErrorToastProps, SuccessToastProps, TextProps } from "./CustomStylings";

const ConfirmationModal = ({
  isOpen,
  toggle,
  apiUrl,
  successMessage,
  color,
  hasSuccessFunc = false,
  onSuccess,
  description,
  body = {},
  isDelete = true,
  isPatch = false,
  isGet = false,
  otherModal,
  toggleOtherModal,
  successStatus,
  showSuccessToast = true,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const { isLoading: isDeleting, toggle: toggleIsDeleting } = useLoading(false);

  const onPressHandler = async () => {
    try {
      toggleIsDeleting();
      if (isDelete) {
        await axiosInstance.delete(apiUrl);
      } else if (isPatch) {
        await axiosInstance.patch(apiUrl);
      } else if (isGet) {
        await axiosInstance.get(apiUrl);
      } else {
        await axiosInstance.post(apiUrl, body);
      }
      toggle();
      toggleIsDeleting();
      if (showSuccessToast) {
        Toast.show(successMessage, SuccessToastProps);
      } else {
        null;
      }

      // If hasSuccessFunc passed then run the available onSuccess function
      if (hasSuccessFunc) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toggleIsDeleting();
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => !isDeleting && toggle()}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      hideModalContentWhileAnimating={true}
      useNativeDriver={false}
      onModalHide={() => {
        if (otherModal && successStatus) {
          toggleOtherModal();
        } else {
          null;
        }
      }}
    >
      <View
        style={{
          display: "flex",
          gap: 10,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <View style={{ display: "flex", alignItems: "center" }}>
          <Image
            source={require("../../assets/vectors/confirmation.jpg")}
            alt="confirmation"
            style={{
              height: 150,
              width: 150,
              resizeMode: "contain",
            }}
          />
          <Text style={[{ textAlign: "center" }, TextProps]}>{description}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Button
            disabled={isDeleting}
            onPress={!isDeleting && toggle}
            flex={1}
            variant="outline"
            backgroundColor="#FD7972"
          >
            <Text style={{ color: "#FD7972" }}>Cancel</Text>
          </Button>

          <Button
            bgColor={isDeleting ? "coolGray.500" : color ? color : "red.600"}
            onPress={onPressHandler}
            startIcon={isDeleting && <ActivityIndicator />}
            flex={1}
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ConfirmationModal);
