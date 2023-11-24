import { Text } from "native-base";
import { Linking, StyleSheet } from "react-native";

export const LinkFormatter = (text = "") => {
  const words = text.split(/\s+/);
  const styledTexts = words.map((item, index) => {
    let textStyle = styles.defaultText;
    if (item.includes("https")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
          {item}{" "}
        </Text>
      );
    } else {
      textStyle = styles.defaultText;
      return (
        <Text key={index} style={textStyle}>
          {item}{" "}
        </Text>
      );
    }
  });

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return {
    formattedText: styledTexts,
  };
};

const styles = StyleSheet.create({
  defaultText: {
    color: "#3F434A",
  },
  highlightedText: {
    color: "#72acdc",
  },
});
