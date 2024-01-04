import { StyleSheet } from "react-native";

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

export { SkeletonCommonProps, TextProps };
