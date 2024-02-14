import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import OngoingReviewKPIListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingReviewKPIListItem";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import { useFetch } from "../../../../hooks/useFetch";

const ReviewKPIListScreen = () => {
  const navigation = useNavigation();

  const {
    data: reviewList,
    refetch: refetchReviewList,
    isFetching: reviewListIsFetching,
  } = useFetch("/hr/employee-review/kpi");

  if (reviewList?.data.length > 0) {
    var tabs = useMemo(() => {
      return [
        { title: `Waiting Review (${reviewList?.data.length || 0})`, value: "Waiting Review" },
        { title: `Personal (${0})`, value: "Personal" },
        { title: `My Team (${0})`, value: "My Team" },
      ];
    }, [reviewList]);
  } else {
    var tabs = useMemo(() => {
      return [
        { title: `Personal (${0})`, value: "Personal" },
        { title: `My Team (${0})`, value: "My Team" },
      ];
    }, [reviewList]);
  }

  const [tabValue, setTabValue] = useState(!reviewList?.data ? "Personal" : "Waiting Review");

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="KPI Review" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tabValue === "Waiting Review" ? (
            <FlashList
              data={reviewList?.data}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <OngoingReviewKPIListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.begin_date}
                  end_date={item?.end_date}
                  navigation={navigation}
                  name={item?.employee?.name}
                  target={item?.performance_kpi?.target_name}
                  dayjs={dayjs}
                />
              )}
            />
          ) : (
            <ScrollView
            // refreshControl={<RefreshControl refreshing={kpiListIsFetching} onRefresh={refetchKpiList} />}
            >
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

export default ReviewKPIListScreen;

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
