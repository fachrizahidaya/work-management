import React from "react";
import { StyleSheet, Text } from "react-native";
import { CopyToClipboard } from "./CopyToClipboard";
import { EmailRedirect } from "./EmailRedirect";

const FeedContentStyle = ({
  words,
  employeeUsername,
  navigation,
  loggedEmployeeId,
  loggedEmployeeImage,
  onPressLink,
}) => {
  const contentStyledTextHandler = words?.map((item, index) => {
    let textStyle = styles.defaultText;
    let specificEmployee;
    specificEmployee = employeeUsername?.find((employee) => item?.includes(employee.username));
    const hasTag = item.includes("<a");
    const hasHref = item.includes("href");

    if (item.includes("https" || "http")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => onPressLink(item)}>
          {item}{" "}
        </Text>
      );
    } else if (hasHref && specificEmployee) {
      const specificEmployeeId = specificEmployee.id;
      item = specificEmployee.username;
      textStyle = styles.highlightedText;
      return (
        <Text
          key={index}
          style={textStyle}
          onPress={() =>
            navigation.navigate("Employee Profile", {
              employeeId: specificEmployeeId,
              loggedEmployeeId: loggedEmployeeId,
              loggedEmployeeImage: loggedEmployeeImage,
            })
          }
        >
          @{item}{" "}
        </Text>
      );
    } else if (hasTag) {
      item = item.replace(`<a`, "");
      textStyle = styles.defaultText;
      return <Text key={index}>{item}</Text>;
    } else if (item.includes("08") || item.includes("62")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => CopyToClipboard(item)}>
          {item}{" "}
        </Text>
      );
    } else if (item.includes("@") && item.includes(".com")) {
      textStyle = styles.highlightedText;
      return (
        <Text key={index} style={textStyle} onPress={() => EmailRedirect(item)}>
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

  return contentStyledTextHandler;
};

export default FeedContentStyle;

const styles = StyleSheet.create({
  defaultText: {
    color: "#000000",
  },
  highlightedText: {
    color: "#72acdc",
  },
});
