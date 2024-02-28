import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import OngoingPerformanceListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceListItem";
import Tabs from "../../../../components/shared/Tabs";
import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import Select from "../../../../components/shared/Forms/Select";
import CustomDateTimePicker from "../../../../components/shared/CustomDateTimePicker";
import FormButton from "../../../../components/shared/FormButton";

const KPIListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const navigation = useNavigation();

  const currentDate = dayjs().format("YYYY-MM-DD");

  const fetchArchivedParameters = {
    begin_date: filterStartDate,
    end_date: filterEndDate,
  };

  const {
    data: kpiList,
    refetch: refetchKpiList,
    isFetching: kpiListIsFetching,
  } = useFetch(tabValue === "Ongoing" && "/hr/employee-kpi/ongoing");

  const { data: archived } = useFetch(
    tabValue === "Archived" && "/hr/employee-kpi/ongoing",
    [filterStartDate, filterEndDate],
    fetchArchivedParameters
  );

  const { data: ongoingData } = useFetch("/hr/employee-kpi/ongoing");

  const filteredData = kpiList?.data
    .map((item) => {
      if (item?.review?.end_date >= currentDate) {
        return item;
      }
    })
    .filter(Boolean);

  const archivedData = kpiList?.data
    .map((item) => {
      if (item?.review?.end_date <= currentDate) {
        return item;
      }
    })
    .filter(Boolean);

  const tabs = useMemo(() => {
    return [
      {
        title: `Ongoing (${ongoingData?.data?.length || 0})`,
        value: "Ongoing",
      },
      { title: `Archived`, value: "Archived" },
    ];
  }, [filteredData, archivedData]);

  const onChangeTab = useCallback(
    (value) => {
      setTabValue(value);
      setOngoingList([]);
      setArchivedList([]);
    },
    [kpiList]
  );

  const startDateChangeHandler = (date) => {
    setStartDate(date);
  };

  const endDateChangeHandler = (date) => {
    setEndDate(date);
  };

  const submitFilterDateHandler = () => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    SheetManager.hide("form-sheet");
  };

  const resetDateHandler = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
  };

  useEffect(() => {
    if (filteredData?.length) {
      setOngoingList((prevData) => [...prevData, ...filteredData]);
    }
  }, [filteredData?.length, tabValue]);

  useEffect(() => {
    if (archivedData?.length) {
      setArchivedList((prevData) => [...prevData, ...archivedData]);
    }
  }, [archivedData?.length, tabValue]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee KPI" backButton={false} />
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
                  <OngoingPerformanceListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.review?.begin_date}
                    end_date={item?.review?.end_date}
                    navigation={navigation}
                    name={item?.review?.description}
                    target={item?.target_name}
                    isExpired={false}
                    target_level={item?.target_level}
                  />
                )}
              />
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={kpiListIsFetching}
                    onRefresh={refetchKpiList}
                  />
                }
              >
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )
          ) : (
            <View style={{ marginTop: 5, flex: 1 }}>
              {/* <View style={{ alignItems: "flex-end" }}>
                <Pressable
                  style={{
                    padding: 5,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#E8E9EB",
                    backgroundColor: "#FFFFFF",
                    width: "10%",
                  }}
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
                              paddingBottom: -20,
                            }}
                          >
                            <View style={{ gap: 5, alignItems: "flex-end" }}>
                              <TouchableOpacity onPress={resetDateHandler}>
                                <Text>Reset</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ gap: 5 }}>
                              <CustomDateTimePicker
                                unlimitStartDate={true}
                                width="100%"
                                defaultValue={
                                  !filterStartDate ? null : filterStartDate
                                }
                                onChange={startDateChangeHandler}
                                title="Begin Date"
                              />
                            </View>
                            <View style={{ gap: 5 }}>
                              <CustomDateTimePicker
                                unlimitStartDate={true}
                                width="100%"
                                defaultValue={
                                  !filterEndDate ? null : filterEndDate
                                }
                                onChange={endDateChangeHandler}
                                title="End Date"
                              />
                            </View>
                            
                          </View>
                        ),
                      },
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="tune-variant"
                      size={20}
                      color="#3F434A"
                    />
                  </View>
                </Pressable>
              </View> */}
              {archivedList?.length > 0 ? (
                <FlashList
                  data={archivedList}
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
                    />
                  )}
                />
              ) : (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={kpiListIsFetching}
                      onRefresh={refetchKpiList}
                    />
                  }
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
