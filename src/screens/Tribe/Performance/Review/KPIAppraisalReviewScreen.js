import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../../components/shared/PageHeader";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../../components/shared/CustomStylings";
import useCheckAccess from "../../../../hooks/useCheckAccess";
import { useFetch } from "../../../../hooks/useFetch";
import Tabs from "../../../../components/shared/Tabs";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import OngoingCommentListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingCommentListItem";
import OngoingReviewAppraisalListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingReviewAppraisalListItem";
import OngoingReviewKPIListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingReviewKPIListItem";

const KPIAppraisalReviewScreen = () => {
  const [tabValue, setTabValue] = useState("KPI");
  const [kpiList, setKpiList] = useState([]);
  const [appraisalList, setAppraisalList] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const navigation = useNavigation();

  const {
    data: kpi,
    refetch: refetchKpi,
    isFetching: kpiIsFetching,
  } = useFetch(tabValue == "KPI" && "/hr/employee-review/kpi");

  const {
    data: appraisal,
    refetch: refetchAppraisal,
    isFetching: appraisalIsFetching,
  } = useFetch(tabValue == "Appraisal" && "/hr/employee-review/appraisal");

  const {
    data: comment,
    refetch: refetchcomment,
    isFetching: commentIsFetching,
  } = useFetch(tabValue == "Comment" && "/hr/employee-review/comment");

  const { data: kpiData } = useFetch("/hr/employee-review/kpi");
  const { data: appraisalData } = useFetch("/hr/employee-review/appraisal");
  const { data: commentData } = useFetch("/hr/employee-review/comment");

  const tabs = useMemo(() => {
    return [
      { title: `KPI (${kpiData?.data.length || 0})`, value: "KPI" },
      { title: `Appraisal (${appraisalData?.data.length || 0})`, value: "Appraisal" },
      { title: `Comment (${commentData?.data.length || 0})`, value: "Comment" },
    ];
  }, [kpi, appraisal, comment, kpiData, appraisalData, commentData]);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setKpiList([]);
    setAppraisalList([]);
    setCommentList([]);
  }, []);

  useEffect(() => {
    if (kpi?.data.length) {
      setKpiList((prevData) => [...prevData, ...kpi?.data]);
    }
  }, [kpi?.data.length]);

  useEffect(() => {
    if (appraisal?.data.length) {
      setAppraisalList((prevData) => [...prevData, ...appraisal?.data]);
    }
  }, [appraisal?.data.length]);

  useEffect(() => {
    if (comment?.data.length) {
      setCommentList((prevData) => [...prevData, ...comment?.data]);
    }
  }, [comment?.data.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee Review" backButton={false} />
      </View>
      <View style={{ paddingHorizontal: 16, backgroundColor: "#FFFFFF" }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={{ backgroundColor: "#f8f8f8", flex: 1, flexDirection: "column" }}>
        {tabValue == "KPI" ? (
          kpiList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlashList
                data={kpiList}
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
                refreshControl={<RefreshControl refreshing={kpiIsFetching} onRefresh={refetchKpi} />}
              />
            </View>
          ) : (
            <ScrollView refreshControl={<RefreshControl refreshing={kpiIsFetching} onRefresh={refetchKpi} />}>
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue == "Appraisal" ? (
          appraisalList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlashList
                data={appraisalList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <OngoingReviewAppraisalListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.begin_date}
                    end_date={item?.end_date}
                    navigation={navigation}
                    name={item?.employee?.name}
                    target={item?.performance_appraisal?.target_name}
                    dayjs={dayjs}
                  />
                )}
                refreshControl={<RefreshControl refreshing={appraisalIsFetching} onRefresh={refetchAppraisal} />}
              />
            </View>
          ) : (
            <ScrollView
              refreshControl={<RefreshControl refreshing={appraisalIsFetching} onRefresh={refetchAppraisal} />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue == "Comment" ? (
          commentList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlashList
                data={commentList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <OngoingCommentListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.performance_review?.begin_date}
                    end_date={item?.performance_review?.end_date}
                    navigation={navigation}
                    name={item?.employee?.name}
                    target={item?.performance_kpi?.target_name}
                    dayjs={dayjs}
                    description={item?.performance_review?.description}
                  />
                )}
                refreshControl={<RefreshControl refreshing={commentIsFetching} onRefresh={refetchcomment} />}
              />
            </View>
          ) : (
            <ScrollView refreshControl={<RefreshControl refreshing={commentIsFetching} onRefresh={refetchcomment} />}>
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default KPIAppraisalReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    position: "relative",
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
