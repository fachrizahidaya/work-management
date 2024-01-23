import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import Tabs from "../../../components/shared/Tabs";
import OngoingAppraisalListItem from "../../../components/Tribe/Performance/OngoingPerformance/OngoingAppraisalListItem";

const AppraisalListScreen = () => {
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

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Appraisal" backButton={true} onPress={() => navigation.goBack()} />
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
              <OngoingAppraisalListItem
                key={index}
                start_date={item?.startDate}
                end_date={item?.endDate}
                navigation={navigation}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppraisalListScreen;

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
