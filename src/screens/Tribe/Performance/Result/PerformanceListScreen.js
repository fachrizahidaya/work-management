import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, View } from "react-native";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import PerformanceList from "../../../../components/Tribe/Performance/Result/PerformanceList";
import CardSkeleton from "../../../../components/Coin/shared/CardSkeleton";

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
    isLoading: personalCommentListIsLoading,
  } = useFetch(
    "/hr/performance-result/personal"
    // [currentPagePersonal, reloadPersonal],
    // fetchPersonalParameters
  );

  const {
    data: teamCommentList,
    refetch: refetchTeamCommentList,
    isFetching: teamCommentListIsFetching,
    isLoading: teamCommentListIsLoading,
  } = useFetch(
    "/hr/performance-result/my-team"
    // [currentPageMyTeam, reloadMyTeam],
    // fetchMyTeamParameters
  );

  var tabs = useMemo(() => {
    if (teamCommentList?.data?.length > 0) {
      return [
        {
          title: `Personal`,
          value: "Personal",
        },
        {
          title: `My Team`,
          value: "My Team",
        },
      ];
    } else {
      return [
        {
          title: `Personal`,
          value: "Personal",
        },
      ];
    }
  }, [teamCommentList, personalCommentList]);

  const [tabValue, setTabValue] = useState(teamCommentList?.data?.length > 0 ? "My Team" : "Personal");

  const onChangeTab = (value) => {
    setTabValue(value);
    if (tabValue === "My Team") {
      setPersonalList([]);
    } else {
      setTeamList([]);
    }
  };

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
        <View style={{ flex: 1 }}>
          {tabValue === "My Team" ? (
            <PerformanceList
              data={teamList}
              isFetching={teamCommentListIsFetching}
              isLoading={teamCommentListIsLoading}
              refetch={refetchTeamCommentList}
              navigation={navigation}
              dayjs={dayjs}
            />
          ) : (
            <PerformanceList
              data={personalList}
              isFetching={personalCommentListIsFetching}
              isLoading={personalCommentListIsLoading}
              refetch={refetchPersonalCommentList}
              navigation={navigation}
              dayjs={dayjs}
            />
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
