import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../../components/shared/PageHeader";
import PerformanceStatistic from "../../../components/Tribe/Performance/PerformanceStatistic.js";

const PerformanceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="My Performance" backButton={false} />
      </View>
      <PerformanceStatistic />
    </SafeAreaView>
  );
};

export default PerformanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
