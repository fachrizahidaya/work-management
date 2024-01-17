import { StyleSheet } from "react-native";
import Toast from "react-native-root-toast";

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 2000,
  },
  backgroundColor: "#D4D4D4",
};

const TextProps = StyleSheet.create({
  color: "#3F434A",
});

const ErrorToastProps = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  animation: true,
  hideOnPress: true,
  shadow: false,
  backgroundColor: "#FF6262",
  textColor: "#FFFFFF",
  opacity: 1,
  delay: 0,
};

const SuccessToastProps = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  animation: true,
  hideOnPress: true,
  shadow: false,
  backgroundColor: "#49C96D",
  textColor: "#FFFFFF",
  opacity: 1,
  delay: 0,
};

export { SkeletonCommonProps, TextProps, ErrorToastProps, SuccessToastProps };
