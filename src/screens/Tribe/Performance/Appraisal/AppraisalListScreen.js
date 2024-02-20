import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, ScrollView, StyleSheet,  View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import OngoingAppraisalListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingAppraisalListItem";
import { useFetch } from "../../../../hooks/useFetch";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";

const AppraisalListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const navigation = useNavigation();

  const {
    data: appraisalList,
    refetch: refetchAppraisalList,
    isFetching: appraisalListIsFetching,
  } = useFetch("/hr/employee-appraisal/ongoing");

  const currentDate = dayjs().format('YYYY-MM-DD')
  const filteredData = appraisalList?.data.map((item) => {
    if (item?.review?.end_date >= currentDate) {
      return item
    }
  }).filter(Boolean)

  const archivedData = appraisalList?.data.map((item) => {
    if (item?.review?.end_date <= currentDate) {
      return item
    }
  }).filter(Boolean)

  const tabs = useMemo(() => {
    return [
      { title: `Ongoing (${filteredData?.length || 0})`, value: "Ongoing" },
      { title: `Archived (${archivedData?.length || 0})`, value: "Archived" },
    ];
  }, [filteredData, archivedData]);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setOngoingList([])
    setArchivedList([])
  }, []);

  useEffect(() => {
    if (
      filteredData?.length
    ) {
      setOngoingList((prevData) => [...prevData, ...filteredData])
    }
  }, [filteredData?.length, tabValue])

  useEffect(() => {
    if (archivedData?.length) {
      setArchivedList((prevData) => [...prevData, ...archivedData])
    }
  }, [archivedData?.length, tabValue])

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee Appraisal" backButton={false} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          {tabValue === "Ongoing" ? (
            ongoingList?.length > 0 ? 
            <FlashList
              data={ongoingList}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <OngoingAppraisalListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.review?.begin_date}
                  end_date={item?.review?.end_date}
                  position={item?.target_level}
                  navigation={navigation}
                  name={item?.review?.description}
                  type="appraisal"
                  target={item?.target_name}
                  isExpired={false}
                />
              )}
            />
            :
            <ScrollView
              refreshControl={<RefreshControl refreshing={appraisalListIsFetching} onRefresh={refetchAppraisalList} />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          ) : (
            archivedList?.length > 0 ? 
            <FlashList
                data={archivedList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <OngoingAppraisalListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.review?.begin_date}
                    end_date={item?.review?.end_date}
                    position={item?.target_level}
                    navigation={navigation}
                    name={item?.review?.description}
                    type="kpi"
                    target={item?.target_name}
                    isExpired={true}
                  />
                )}
              />
            :
            <ScrollView
              refreshControl={<RefreshControl refreshing={appraisalListIsFetching} onRefresh={refetchAppraisalList} />}
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
