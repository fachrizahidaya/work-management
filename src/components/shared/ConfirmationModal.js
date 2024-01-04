import { memo } from "react";

import { ActivityIndicator, Dimensions, Image, Platform, Text, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import axiosInstance from "../../config/api";
import { useLoading } from "../../hooks/useLoading";
import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";

const ConfirmationModal = ({
  isOpen,
  toggle,
  apiUrl,
  successMessage,
  color,
  hasSuccessFunc = false,
  onSuccess,
  header,
  description,
  body = {},
  isDelete = true,
  isPatch = false,
  placement,
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
      } else {
        await axiosInstance.post(apiUrl, body);
      }
      toggle();
      toggleIsDeleting();

      Toast.show({
        type: "success",
        text1: successMessage,
        position: placement ? placement : "bottom",
      });

      // If hasSuccessFunc passed then run the available onSuccess function
      if (hasSuccessFunc) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toggleIsDeleting();

      Toast.show({
        type: "error",
        text1: error.response.data.message,
        position: "bottom",
      });
    }
  };
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={!isDeleting && toggle}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
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
