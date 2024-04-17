import { useState } from "react";

import { LayoutAnimation, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const FAQCard = ({ question, answer, index }) => {
  const [menuIndex, setMenuIndex] = useState(-1);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      key={index}
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.create(200, "easeInEaseOut", "opacity"));
        setMenuIndex(menuIndex === index ? -1 : index);
      }}
    >
      <View style={styles.container}>
        <Text style={[TextProps, { color: "#ffffff", width: "80%" }]}>{question}</Text>
        <MaterialCommunityIcons
          name={"chevron-right"}
          size={20}
          color="#ffffff"
          style={{ transform: [{ rotate: menuIndex === index ? "90deg" : "0deg" }] }}
        />
      </View>
      {menuIndex === index && (
        <View
          style={{
            backgroundColor: "#f8f8f8",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          {answer.map((subMenu, index) => {
            return (
              <TouchableNativeFeedback key={index}>
                <View style={{ padding: 10 }}>
                  <Text style={[TextProps, { width: "90%" }]}>{subMenu.title}</Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FAQCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#176688",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
