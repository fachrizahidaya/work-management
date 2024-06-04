import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import AppraisalListItem from "../../../../components/Tribe/Performance/Appraisal/AppraisalListItem";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import ArchivedAppraisalFilter from "../../../../components/Tribe/Performance/Appraisal/ArchivedAppraisalFilter";

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

  const tabs = useMemo(() => {
    return [
      {
        title: `Ongoing`,
        value: "Ongoing",
      },
      { title: `Archived`, value: "Archived" },
    ];
  }, [appraisalList, archived]);

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
    if (appraisalList?.data?.length) {
      setOngoingList((prevData) => [...prevData, ...appraisalList?.data]);
    }
  }, [appraisalList?.data?.length, tabValue]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee Appraisal" backButton={true} onPress={() => navigation.goBack()} />
        {tabValue === "Archived" && (
          <ArchivedAppraisalFilter
            startDate={startDate}
            endDate={endDate}
            startDateChangeHandler={startDateChangeHandler}
            endDateChangeHandler={endDateChangeHandler}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {tabValue === "Ongoing" ? (
            ongoingList?.length > 0 ? (
              <FlashList
                data={ongoingList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <AppraisalListItem
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
                  <RefreshControl refreshing={appraisalListIsFetching} onRefresh={refetchAppraisalList} />
                }
              >
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )
          ) : (
            <View style={{ flex: 1 }}>
              {archived?.data?.length > 0 ? (
                <FlashList
                  data={archived?.data}
                  estimatedItemSize={50}
                  onEndReachedThreshold={0.1}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item, index }) => (
                    <AppraisalListItem
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
