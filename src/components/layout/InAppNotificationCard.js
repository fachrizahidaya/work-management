import React, { memo, useEffect, useRef } from "react";

import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const InAppNotificationCard = ({ message, isOpen, close, memberName, messageData }) => {
  const autoCloseTimeout = useRef(null);
  const { width } = Dimensions.get("screen");

  const tStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen && message ? 1 : 0),
    left: withTiming(isOpen && message ? 0 : -100),
    width: withTiming(isOpen && message ? width : 0),
  }));

  for (let i = 0; i < memberName?.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    messageData = messageData?.replace(placeholder, `@${memberName[i]}`);
  }

  var allWords = [];

  for (var i = 0; i < memberName?.length; i++) {
    var words = memberName[i].split(/\s+/);
    allWords = allWords.concat(words);
  }

  let styledTexts = null;
  if (messageData?.length !== 0) {
    let words;
    if (typeof messageData === "number" || typeof messageData === "bigint") {
      words = messageData.toString().split(" ");
    } else {
      words = messageData?.split(" ");
    }
    styledTexts = words?.map((item, index) => {
      if (allWords?.find((word) => item?.includes(word))) {
        return (
          <Text key={index} style={{ color: "white" }}>
            {item}{" "}
          </Text>
        );
      }
      return (
        <Text key={index} style={{ color: "white" }}>
          {item}{" "}
        </Text>
      );
    });
  }

  // Clear the timeout when the close button is pressed
  const handlePressClose = () => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
    }
    close(); // Call the close function
  };

  useEffect(() => {
    if (isOpen) {
      // Set a timeout for automatic close after 5 seconds
      autoCloseTimeout.current = setTimeout(() => {
        close(); // Call the close function after 5 seconds
      }, 5000);
    }

    return () => {
      // Clear the timeout if the component unmounts or is closed manually
      if (autoCloseTimeout.current) {
        clearTimeout(autoCloseTimeout.current);
      }
    };
  }, [isOpen, close]);

  return (
    <Animated.View style={[styles.container, tStyle]}>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "baseline",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>Nest</Text>

          <Text style={{ fontSize: 12, color: "white" }}>now</Text>
        </View>

        <Text style={{ color: "white", fontSize: 14 }}>
          {message?.from_name} : {styledTexts?.length > 30 ? styledTexts?.slice(0, 30) + "..." : styledTexts}
        </Text>
      </View>

      <TouchableOpacity onPress={handlePressClose}>
        <MaterialCommunityIcons name="close" color="white" size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#176688",
    padding: 20,
    position: "absolute",
    bottom: -80,
  },
});

export default memo(InAppNotificationCard);
