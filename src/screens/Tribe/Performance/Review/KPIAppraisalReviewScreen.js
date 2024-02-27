import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import Tabs from "../../../../components/shared/Tabs";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import OngoingReviewAppraisalListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingReviewAppraisalListItem";
import OngoingReviewKPIListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingReviewKPIListItem";
import OngoingCommentListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingCommentListItem";

const KPIAppraisalReviewScreen = () => {
  const [tabValue, setTabValue] = useState("KPI");
  const [kpiList, setKpiList] = useState([]);
  const [appraisalList, setAppraisalList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [currentPageKPI, setCurrentPageKPI] = useState(1);
  const [currentPageAppraisal, setCurrentPageAppraisal] = useState(1);
  const [currentPageComment, setCurrentPageComment] = useState(1);
  const [reloadKpi, setReloadKpi] = useState(false);
  const [reloadAppraisal, setReloadAppraisal] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [kpiHasBeenScrolled, setKpiHasBeenScrolled] = useState(false);
  const [appraisalHasBeenScrolled, setAppraisalHasBeenScrolled] =
    useState(false);
  const [commentHasBeenScrolled, setCommentHasBeenScrolled] = useState(false);

  const navigation = useNavigation();

  const fetchKpiParameters = {
    page: currentPageKPI,
    limit: 10,
  };

  const fetchAppraisalParameters = {
    page: currentPageAppraisal,
    limit: 10,
  };

  const fetchCommentParameters = {
    page: currentPageComment,
    limit: 10,
  };

  const {
    data: kpi,
    refetch: refetchKpi,
    isFetching: kpiIsFetching,
  } = useFetch(
    tabValue == "KPI" && "/hr/employee-review/kpi",
    [currentPageKPI, reloadKpi, tabValue],
    fetchKpiParameters
  );

  const {
    data: appraisal,
    refetch: refetchAppraisal,
    isFetching: appraisalIsFetching,
  } = useFetch(
    tabValue == "Appraisal" && "/hr/employee-review/appraisal",
    [tabValue, currentPageAppraisal, reloadAppraisal],
    fetchAppraisalParameters
  );

  const {
    data: comment,
    refetch: refetchComment,
    isFetching: commentIsFetching,
  } = useFetch(
    tabValue == "Comment" && "/hr/employee-review/comment",
    [tabValue, currentPageComment, reloadComment],
    fetchCommentParameters
  );

  const { data: kpiData } = useFetch("/hr/employee-review/kpi");
  const { data: appraisalData } = useFetch("/hr/employee-review/appraisal");
  const { data: commentData } = useFetch("/hr/employee-review/comment");

  const tabs = useMemo(() => {
    return [
      { title: `KPI (${kpiData?.data?.length || 0})`, value: "KPI" },
      {
        title: `Appraisal (${appraisalData?.data?.length || 0})`,
        value: "Appraisal",
      },
      {
        title: `Comment (${commentData?.data?.length || 0})`,
        value: "Comment",
      },
    ];
  }, [kpi, appraisal, comment, kpiData, appraisalData, commentData]);

  const fetchMoreKpi = () => {
    if (currentPageKPI < kpi?.data?.last_page) {
      setCurrentPageKPI(currentPageKPI + 1);
      setReloadKpi(!reloadKpi);
    }
  };

  const fetchMoreAppraisal = () => {
    if (currentPageAppraisal < appraisal?.data?.last_page) {
      setCurrentPageAppraisal(currentPageAppraisal + 1);
      setReloadAppraisal(!reloadAppraisal);
    }
  };

  const fetchMoreComment = () => {
    if (currentPageComment < comment?.data?.last_page) {
      setCurrentPageComment(currentPageComment + 1);
      setReloadComment(!reloadComment);
    }
  };

  const onChangeTab = useCallback(
    (value) => {
      setTabValue(value);
      setKpiList([]);
      setAppraisalList([]);
      setCommentList([]);
      setCurrentPageKPI(1);
      setCurrentPageAppraisal(1);
      setCurrentPageComment(1);
    },
    [kpiData, appraisalData, commentData, kpi, appraisal, comment]
  );

  useEffect(() => {
    if (kpi?.data?.data.length) {
      setKpiList((prevData) => [...prevData, ...kpi?.data?.data]);
    }
  }, [kpi?.data?.data.length, tabValue]);

  useEffect(() => {
    if (appraisal?.data?.data.length) {
      setAppraisalList((prevData) => [...prevData, ...appraisal?.data?.data]);
    }
  }, [appraisal?.data?.data.length, tabValue]);

  useEffect(() => {
    if (comment?.data?.data.length) {
      setCommentList((prevData) => [...prevData, ...comment?.data?.data]);
    }
  }, [comment?.data?.data.length, tabValue]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee Review" backButton={false} />
      </View>
      <View style={{ paddingHorizontal: 16, backgroundColor: "#FFFFFF" }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View
        style={{ backgroundColor: "#f8f8f8", flex: 1, flexDirection: "column" }}
      >
        {tabValue == "KPI" ? (
          kpiList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlashList
                data={kpiList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                onScrollBeginDrag={() =>
                  setKpiHasBeenScrolled(!kpiHasBeenScrolled)
                }
                onEndReached={kpiHasBeenScrolled === true ? fetchMoreKpi : null}
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
                    target_level={item?.performance_kpi?.target_level}
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={kpiIsFetching}
                    onRefresh={refetchKpi}
                  />
                }
              />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={kpiIsFetching}
                  onRefresh={refetchKpi}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue === "Appraisal" ? (
          appraisalList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlashList
                data={appraisalList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                onScrollBeginDrag={() =>
                  setAppraisalHasBeenScrolled(!appraisalHasBeenScrolled)
                }
                onEndReached={
                  appraisalHasBeenScrolled === true ? fetchMoreAppraisal : null
                }
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
                    target_level={item?.performance_appraisal?.target_level}
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={appraisalIsFetching}
                    onRefresh={refetchAppraisal}
                  />
                }
              />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={appraisalIsFetching}
                  onRefresh={refetchAppraisal}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : commentList?.length > 0 ? (
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <FlashList
              data={commentList}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() =>
                setCommentHasBeenScrolled(!commentHasBeenScrolled)
              }
              onEndReached={
                commentHasBeenScrolled === true ? fetchMoreComment : null
              }
              renderItem={({ item, index }) => (
                <OngoingCommentListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.begin_date}
                  end_date={item?.end_date}
                  navigation={navigation}
                  name={item?.employee?.name}
                  target={item?.performance_comment?.target_name}
                  dayjs={dayjs}
                  target_level={item?.performance_comment?.target_level}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={commentIsFetching}
                  onRefresh={refetchComment}
                />
              }
            />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={commentIsFetching}
                onRefresh={refetchComment}
              />
            }
          >
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )}
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
