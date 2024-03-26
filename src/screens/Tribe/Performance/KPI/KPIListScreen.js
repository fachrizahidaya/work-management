import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import Tabs from "../../../../components/shared/Tabs";
import PageHeader from "../../../../components/shared/PageHeader";
import KPIListItem from "../../../../components/Tribe/Performance/KPI/KPIListItem";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import ArchivedKPIFilter from "../../../../components/Tribe/Performance/KPI/ArchivedKPIFilter";

const KPIListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigation = useNavigation();

  const fetchArchivedParameters = {
    begin_date: startDate,
    end_date: endDate,
  };

  const {
    data: kpiList,
    refetch: refetchKpiList,
    isFetching: kpiListIsFetching,
  } = useFetch(tabValue === "Ongoing" && "/hr/employee-kpi/ongoing");

  const { data: archived } = useFetch(
    tabValue === "Archived" && "/hr/employee-kpi/ongoing",
    [startDate, endDate],
    fetchArchivedParameters
  );

  const tabs = useMemo(() => {
    return [
      {
        title: `Ongoing`,
        value: "Ongoing",
      },
      { title: `Archived`, value: "Archived" },
    ];
  }, [kpiList, archived]);

  const onChangeTab = (value) => {
    setTabValue(value);
    if (tabValue === "Ongoing") {
      setStartDate(null);
      setEndDate(null);
    } else {
      setOngoingList([]);
    }
  };

  /**
   * Handle start and end date archived
   * @param {*} date
   */
  const startDateChangeHandler = (date) => {
    setStartDate(date);
  };
  const endDateChangeHandler = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    if (kpiList?.data?.length) {
      setOngoingList((prevData) => [...prevData, ...kpiList?.data]);
    }
  }, [kpiList?.data?.length, tabValue]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tabValue === "Ongoing" ? (
            ongoingList?.length > 0 ? (
              <FlashList
                data={ongoingList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <KPIListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.review?.begin_date}
                    end_date={item?.review?.end_date}
                    navigation={navigation}
                    name={item?.review?.description}
                    target={item?.target_name}
                    isExpired={false}
                    target_level={item?.target_level}
                    status="ongoing"
                  />
                )}
              />
            ) : (
              <ScrollView refreshControl={<RefreshControl refreshing={kpiListIsFetching} onRefresh={refetchKpiList} />}>
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )
          ) : (
            <View style={{ marginTop: 5, flex: 1 }}>
              {archived?.data?.length > 0 ? (
                <>
                  <ArchivedKPIFilter
                    startDate={startDate}
                    startDateChangeHandler={startDateChangeHandler}
                    endDate={endDate}
                    endDateChangeHandler={endDateChangeHandler}
                  />
                  <FlashList
                    data={archived?.data}
                    estimatedItemSize={50}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                      <OngoingPerformanceListItem
                        key={index}
                        id={item?.id}
                        start_date={item?.review?.begin_date}
                        end_date={item?.review?.end_date}
                        navigation={navigation}
                        name={item?.review?.description}
                        target={item?.target_name}
                        isExpired={true}
                        status="archived"
                      />
                    )}
                  />
                </>
              ) : (
                <ScrollView
                  refreshControl={<RefreshControl refreshing={kpiListIsFetching} onRefresh={refetchKpiList} />}
                >
                  <View style={styles.content}>
                    <EmptyPlaceholder height={250} width={250} text="No Data" />
                  </View>
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KPIListScreen;

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
