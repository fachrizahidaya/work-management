import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../../components/shared/PageHeader";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../../components/shared/CustomStylings";

const KPIAppraisalReviewScreen = () => {
  const navigation = useNavigation();

  const menu = [
    {
      name: "KPI",
      icon: "file-check-outline",
      navigation: "Review KPI",
    },
    {
      name: "Appraisal",
      icon: "file-chart-outline",
      navigation: "Review Appraisal",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="My Performance" backButton={false} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {menu.map((item, index) => {
            return (
              <Pressable
                style={{
                  ...card.card,
                  elevation: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  width: 100,
                }}
                onPress={() => navigation.navigate(item.navigation)}
                key={index}
              >
                <MaterialCommunityIcons name={item.icon} size={30} />
                <Text style={[{}, TextProps]}>{item.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KPIAppraisalReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
