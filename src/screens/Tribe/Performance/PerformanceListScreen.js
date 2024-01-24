import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import OngoingPerformanceListItem from "../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceListItem";
import Tabs from "../../../components/shared/Tabs";
import PageHeader from "../../../components/shared/PageHeader";

const PerformanceListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

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
      status: "Pending",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      position: { position_name: "Mobile Developer" },
      division: "Tech",
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="KPI" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} flexDir="row" justify="space-evenly" gap={2} />
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <FlashList
            data={ongoingData}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <OngoingPerformanceListItem
                key={index}
                start_date={item?.startDate}
                end_date={item?.endDate}
                status={item?.status}
                position={item?.position.position_name}
                navigation={navigation}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PerformanceListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
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
