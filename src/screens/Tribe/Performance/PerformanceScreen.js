import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import Select from "../../../components/shared/Forms/Select.js";
import OngoingPerformanceList from "../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceList.js";
import HistoryPerformanceList from "../../../components/Tribe/Performance/HistoryPerformance/HistoryPerformanceList.js";

const PerformanceScreen = () => {
  const [filterYear, setFilterYear] = useState(dayjs().format("YYYY"));
  const [performanceType, setPerformanceType] = useState(null);

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
          gap: 15,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Ongoing</Text>
          <Pressable
            style={{ padding: 5, borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB" }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View
                      style={{
                        display: "flex",
                        gap: 21,
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        paddingBottom: 40,
                      }}
                    >
                      <Select
                        value={performanceType}
                        placeHolder={performanceType ? performanceType : "Select Type"}
                        items={[
                          { value: null, label: "All" },
                          { value: "kpi", label: "KPI" },
                          { value: "appraisal", label: "Appraisal" },
                          // ...(Array.isArray(members) &&
                          // members.map((member) => {
                          //   return {
                          //     value: member.user_id || member.responsible_id,
                          //     label: member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0],
                          //   };
                          // })),
                        ]}
                        onChange={(value) => setPerformanceType(value)}
                        hasParentSheet
                      />
                    </View>
                  ),
                },
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
            </View>
          </Pressable>
        </View>
        <OngoingPerformanceList data={ongoingData} />
      </View>
      <View
        style={{
          gap: 15,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>History</Text>
          <Pressable
            style={{ padding: 5, borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB" }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View
                      style={{
                        display: "flex",
                        gap: 21,
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        paddingBottom: 40,
                      }}
                    >
                      <Select
                        value={filterYear}
                        placeHolder={filterYear ? filterYear : "Select Year"}
                        items={[
                          { value: 2024, label: 2024 },
                          { value: 2023, label: 2023 },
                          // ...(Array.isArray(members) &&
                          // members.map((member) => {
                          //   return {
                          //     value: member.user_id || member.responsible_id,
                          //     label: member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0],
                          //   };
                          // })),
                        ]}
                        onChange={(value) => setFilterYear(value)}
                        hasParentSheet
                      />
                    </View>
                  ),
                },
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
            </View>
          </Pressable>
        </View>
        <HistoryPerformanceList data={historyData} />
      </View>
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
