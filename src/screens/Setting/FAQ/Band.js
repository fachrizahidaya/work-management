import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../../components/shared/CustomStylings";
import PageHeader from "../../../components/shared/PageHeader";

const Band = () => {
  const [menuIndex, setMenuIndex] = useState(-1);

  const navigation = useNavigation();

  const array = [
    { question: "test question 1", answer: [{ title: "test answer 1" }], icon: "chevron-right" },
    { question: "test question 2", answer: [{ title: "test answer 2" }], icon: "chevron-right" },
    { question: "test question 3", answer: [{ title: "test answer 3" }], icon: "chevron-right" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, display: "flex", marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="Tribe FAQs" onPress={() => navigation.goBack()} />
        <View style={{ display: "flex", gap: 17 }}>
          {array.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.create(200, "easeInEaseOut", "opacity"));
                  setMenuIndex(menuIndex === index ? -1 : index);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: 10,
                    backgroundColor: "#176688",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Text style={[TextProps, { color: "#ffffff" }]}>{item.question}</Text>
                  <MaterialCommunityIcons
                    name={item.icon}
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
                    {item.answer.map((subMenu, index) => {
                      return (
                        <TouchableNativeFeedback key={index}>
                          <View style={{ padding: 10 }}>
                            <Text style={[TextProps]}>{subMenu.title}</Text>
                          </View>
                        </TouchableNativeFeedback>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Band;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
