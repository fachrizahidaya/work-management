import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { card } from "../../../styles/Card.js";
import { TextProps } from "../../../components/shared/CustomStylings.js";

const PerformanceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="My Performance" backButton={false} />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Pressable
          style={{
            ...card.card,
            marginVertical: 5,
            elevation: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: 100,
          }}
          onPress={() => navigation.navigate("KPI Screen")}
        >
          <Text style={[{}, TextProps]}>KPI</Text>
          <MaterialCommunityIcons name="file-check-outline" size={30} />
        </Pressable>
        <Pressable
          style={{
            ...card.card,
            marginVertical: 5,
            elevation: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: 100,
          }}
          onPress={() => navigation.navigate("Appraisal Screen")}
        >
          <Text style={[{}, TextProps]}>Appraisal</Text>
          <MaterialCommunityIcons name="file-chart-outline" size={30} />
        </Pressable>
        <View
          style={{
            ...card.card,
            marginVertical: 5,
            elevation: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: 100,
          }}
        >
          <Text style={[{}, TextProps]}>Review</Text>
          <MaterialCommunityIcons name="file-account-outline" size={30} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PerformanceScreen;

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
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
