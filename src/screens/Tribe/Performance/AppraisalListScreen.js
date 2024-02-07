import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import Tabs from "../../../components/shared/Tabs";
import OngoingAppraisalListItem from "../../../components/Tribe/Performance/OngoingPerformance/OngoingAppraisalListItem";
import { useFetch } from "../../../hooks/useFetch";
import OngoingPerformanceListItem from "../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceListItem";
import EmptyPlaceholder from "../../../components/shared/EmptyPlaceholder";

const AppraisalListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const navigation = useNavigation();

  const { data: appraisalList } = useFetch("/hr/employee-appraisal/ongoing");

  const tabs = useMemo(() => {
    return [
      { title: "Ongoing", value: "Ongoing" },
      { title: "Archived", value: "Archived" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Appraisal" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} flexDir="row" justify="space-evenly" gap={2} />
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          {tabValue === "Ongoing" ? (
            <FlashList
              data={appraisalList?.data}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <OngoingPerformanceListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.review?.begin_date}
                  end_date={item?.review?.end_date}
                  position={item?.target_level}
                  navigation={navigation}
                  name={item?.review?.description}
                  type="appraisal"
                />
              )}
            />
          ) : (
            <ScrollView>
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});