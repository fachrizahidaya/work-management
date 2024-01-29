import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import OngoingPerformanceListItem from "../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceListItem";
import Tabs from "../../../components/shared/Tabs";
import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";

const PerformanceListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const navigation = useNavigation();

  const { data: kpiList } = useFetch("/hr/performance-kpi");

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

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="KPI" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} flexDir="row" justify="space-evenly" gap={2} />
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlashList
            data={kpiList?.data}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <OngoingPerformanceListItem
                key={index}
                id={item?.id}
                start_date={item?.created_at}
                position={item?.target_level}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
