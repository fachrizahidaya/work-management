import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import OngoingAppraisalListItem from "../../../../components/Tribe/Performance/Appraisal/OngoingAppraisalListItem";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import CustomDateTimePicker from "../../../../components/shared/CustomDateTimePicker";

const AppraisalListScreen = () => {
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
    data: appraisalList,
    refetch: refetchAppraisalList,
    isFetching: appraisalListIsFetching,
  } = useFetch(tabValue === "Ongoing" && "/hr/employee-appraisal/ongoing");

  const { data: archived } = useFetch(
    tabValue === "Archived" && "/hr/employee-appraisal/ongoing",
    [startDate, endDate],
    fetchArchivedParameters
  );

  const { data: ongoingData } = useFetch("/hr/employee-appraisal/ongoing");

  const tabs = useMemo(() => {
    return [
      {
        title: `Ongoing (${ongoingData?.data?.length || 0})`,
        value: "Ongoing",
      },
      { title: `Archived`, value: "Archived" },
    ];
  }, [appraisalList, archived]);

  const onChangeTab = useCallback(
    (value) => {
      setTabValue(value);
      setOngoingList([]);
      setStartDate(null);
      setEndDate(null);
    },
    [appraisalList, archived]
  );

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
    if (appraisalList?.data?.length) {
      setOngoingList((prevData) => [...prevData, ...appraisalList?.data]);
    }
  }, [appraisalList?.data?.length, tabValue]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee Appraisal" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          {tabValue === "Ongoing" ? (
            ongoingList?.length > 0 ? (
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
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={appraisalListIsFetching} onRefresh={refetchAppraisalList} />
                }
              >
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )
          ) : (
            <View style={{ marginTop: 5, flex: 1 }}>
              {archived?.data?.length > 0 ? (
                <>
                  <View style={{ alignItems: "flex-end" }}>
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
                                <View style={{ gap: 5 }}>
                                  <CustomDateTimePicker
                                    unlimitStartDate={true}
                                    width="100%"
                                    defaultValue={startDate ? startDate : null}
                                    onChange={startDateChangeHandler}
                                    title="Begin Date"
                                  />
                                </View>
                                <View style={{ gap: 5 }}>
                                  <CustomDateTimePicker
                                    unlimitStartDate={true}
                                    width="100%"
                                    defaultValue={endDate ? endDate : null}
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
                        <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
                      </View>
                    </Pressable>
                  </View>
                  <FlashList
                    data={archived?.data}
                    estimatedItemSize={50}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                      <OngoingAppraisalListItem
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
                  refreshControl={
                    <RefreshControl refreshing={appraisalListIsFetching} onRefresh={refetchAppraisalList} />
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
