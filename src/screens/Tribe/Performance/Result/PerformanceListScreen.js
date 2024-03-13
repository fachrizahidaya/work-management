import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import PerformanceListItem from "../../../../components/Tribe/Performance/Result/PerformanceListItem";

const PerformanceListScreen = () => {
  const [personalList, setPersonalList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [currentPagePersonal, setCurrentPagePersonal] = useState(1);
  const [currentPageMyTeam, setCurrentPageMyTeam] = useState(1);
  const [reloadPersonal, setReloadPersonal] = useState(false);
  const [reloadMyTeam, setReloadMyTeam] = useState(false);
  const [personalHasBeenScrolled, setPersonalHasBeenScrolled] = useState(false);
  const [myTeamHasBeenScrolled, setMyTeamHasBeenScrolled] = useState(false);

  const navigation = useNavigation();

  // const fetchPersonalParameters = {
  //   page: currentPagePersonal,
  //   limit: 10,
  // };

  // const fetchMyTeamParameters = {
  //   page: currentPageMyTeam,
  //   limit: 10,
  // };

  const {
    data: personalCommentList,
    refetch: refetchPersonalCommentList,
    isFetching: personalCommentListIsFetching,
  } = useFetch(
    "/hr/performance-result/personal"
    // [currentPagePersonal, reloadPersonal],
    // fetchPersonalParameters
  );

  const {
    data: teamCommentList,
    refetch: refetchTeamCommentList,
    isFetching: teamCommentListIsFetching,
  } = useFetch(
    "/hr/performance-result/my-team"
    // [currentPageMyTeam, reloadMyTeam],
    // fetchMyTeamParameters
  );

  if (teamCommentList?.data.length > 0) {
    var tabs = useMemo(() => {
      return [
        {
          title: `Personal (${personalCommentList?.data.length || 0})`,
          value: "Personal",
        },
        {
          title: `My Team (${teamCommentList?.data.length || 0})`,
          value: "My Team",
        },
      ];
    }, [teamCommentList, personalCommentList]);
  } else {
    var tabs = useMemo(() => {
      return [
        {
          title: `Personal (${personalCommentList?.data.length || 0})`,
          value: "Personal",
        },
      ];
    }, [personalCommentList]);
  }

  const [tabValue, setTabValue] = useState(personalCommentList?.data.length > 0 ? "Personal" : "My Team");

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setPersonalList([]);
    setTeamList([]);
    // setCurrentPagePersonal(1);
    // setCurrentPageMyTeam(1);
  }, []);

  // const fetchMorePersonal = () => {
  //   if (currentPagePersonal < personalCommentList?.data?.last_page) {
  //     setCurrentPagePersonal(currentPagePersonal + 1);
  //     setReloadPersonal(!reloadPersonal);
  //   }
  // };

  // const fetchMoreMyTeam = () => {
  //   if (currentPageMyTeam < teamCommentList?.data?.last_page) {
  //     setCurrentPageMyTeam(currentPageMyTeam + 1);
  //     setReloadMyTeam(!reloadMyTeam);
  //   }
  // };

  useEffect(() => {
    if (personalCommentList?.data.length) {
      setPersonalList((prevData) => [...prevData, ...personalCommentList?.data]);
    }
  }, [personalCommentList?.data.length, tabValue]);

  useEffect(() => {
    if (teamCommentList?.data.length) {
      setTeamList((prevData) => [...prevData, ...teamCommentList?.data]);
    }
  }, [teamCommentList?.data.length, tabValue]);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Performance Result" backButton={true} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tabValue === "My Team" ? (
            teamList.length > 0 ? (
              <FlashList
                data={teamList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                // onScrollBeginDrag={() =>
                //   setPersonalHasBeenScrolled(!personalHasBeenScrolled)
                // }
                // onEndReached={
                //   personalHasBeenScrolled === true ? fetchMorePersonal : null
                // }
                renderItem={({ item, index }) => (
                  <PerformanceListItem
                    key={index}
                    id={item?.id}
                    start_date={item?.performance_review?.begin_date}
                    end_date={item?.performance_review?.end_date}
                    navigation={navigation}
                    name={item?.employee?.name}
                    target={null}
                    dayjs={dayjs}
                    description={item?.performance_review?.description}
                    type="my-team"
                  />
                )}
                refreshControl={
                  <RefreshControl refreshing={teamCommentListIsFetching} onRefresh={refetchTeamCommentList} />
                }
              />
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={teamCommentListIsFetching} onRefresh={refetchTeamCommentList} />
                }
              >
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )
          ) : personalList.length > 0 ? (
            <FlashList
              data={personalList}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              // onScrollBeginDrag={() =>
              //   setMyTeamHasBeenScrolled(!myTeamHasBeenScrolled)
              // }
              // onEndReached={
              //   myTeamHasBeenScrolled === true ? fetchMoreMyTeam : null
              // }
              renderItem={({ item, index }) => (
                <PerformanceListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.performance_review?.begin_date}
                  end_date={item?.performance_review?.end_date}
                  navigation={navigation}
                  name={item?.employee?.name}
                  dayjs={dayjs}
                  description={item?.performance_review?.description}
                  type="personal"
                />
              )}
              refreshControl={
                <RefreshControl refreshing={personalCommentListIsFetching} onRefresh={refetchPersonalCommentList} />
              }
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={personalCommentListIsFetching} onRefresh={refetchPersonalCommentList} />
              }
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

export default PerformanceListScreen;

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
