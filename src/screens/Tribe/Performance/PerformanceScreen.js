import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import Select from "../../../components/shared/Forms/Select.js";
import PerformanceListScreen from "../../Tribe/Performance/PerformanceListScreen.js";
import HistoryPerformanceList from "../../../components/Tribe/Performance/HistoryPerformance/HistoryPerformanceList.js";
import { card } from "../../../styles/Card.js";
import { TextProps } from "../../../components/shared/CustomStylings.js";

const PerformanceScreen = () => {
  const [filterYear, setFilterYear] = useState(dayjs().format("YYYY"));
  const [performanceType, setPerformanceType] = useState(null);

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [
      { title: "Ongoing", value: "Ongoing" },
      { title: "Archived", value: "Archived" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setOngoingList([]);
    setArchivedList([]);
  }, []);

  const ongoingData = [
    {
      id: 1,
      year: 2024,
      period: 3,
      type: "KPI",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      position: [
        {
          id: 1,
          position_name: "Front-End Developer",
        },
        { id: 2, position_name: "Mobile Developer" },
        { id: 3, position_name: "Back-End Developer" },
      ],
      division: "Tech",
    },
    {
      id: 2,
      year: 2024,
      period: 3,
      type: "Appraisal",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      division: [
        {
          id: 1,
          division_name: "Tech",
        },
        { id: 2, division_name: "Finance" },
        { id: 3, division_name: "Sales" },
      ],
    },
  ];

  const historyData = [
    {
      id: 1,
      year: 2024,
      period: 1,
      type: [
        {
          id: 1,
          year: 2024,
          period: 1,
          name: "KPI",
          achievement: 80,
        },
        {
          id: 2,
          year: 2024,
          period: 1,
          name: "Appraisal",
          achievement: 70,
        },
      ],
      achievement: 75,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      employee_id: 1,
      employee_name: "Fachriza",
      employee_position: "Mobile Developer",
      employee_division: "Tech",
    },
    {
      id: 2,
      year: 2024,
      period: 2,
      type: [
        {
          id: 1,
          year: 2024,
          period: 1,
          name: "KPI",
          achievement: 80,
        },
      ],
      achievement: 80,
      startDate: "2024-04-01",
      endDate: "2024-06-31",
      employee_id: 1,
      employee_name: "Fachriza",
      employee_position: "Mobile Developer",
      employee_division: "Tech",
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
          <Text style={[{}, TextProps]}>Appraisal</Text>
          <MaterialCommunityIcons name="file-chart-outline" size={30} />
        </View>
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
