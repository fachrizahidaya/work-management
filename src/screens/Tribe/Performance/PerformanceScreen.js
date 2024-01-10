import React, { useEffect, useState } from "react";

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import PerformanceStatistic from "../../../components/Tribe/Performance/PerformanceStatistic.js";
import PerformancePoint from "../../../components/Tribe/Performance/PerformancePoint.js";

const PerformanceScreen = () => {
  const [pin, setPin] = useState({
    latitude: 13.406,
    longitude: 123.3753,
  });
  const [location, setLocation] = useState(null);

  const data = [
    { period: "Q1", point: 60 },
    { period: "Q2", point: 90 },
    { period: "Q3", point: 50 },
    { period: "Q4", point: 80 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="My Performance" backButton={false} />
      </View>
      <PerformanceStatistic />
      <FlashList
        data={data}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, gap: 5, paddingVertical: 5, paddingHorizontal: 10 }}>
            <PerformancePoint key={index} period={item.period} point={item.point} />
          </View>
        )}
      />
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
