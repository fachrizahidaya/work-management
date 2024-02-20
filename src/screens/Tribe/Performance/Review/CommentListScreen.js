import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import Tabs from "../../../../components/shared/Tabs";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import { useFetch } from "../../../../hooks/useFetch";
import OngoingCommentListItem from "../../../../components/Tribe/Performance/OngoingPerformance/OngoingCommentListItem";
import CommentListItem from "../../../../components/Tribe/Performance/Comment/CommentListItem";

const CommentListScreen = () => {
  const [ongoingList, setOngoingList] = useState([])
  const [personalList, setPersonalList] = useState([])
  const [teamList, setTeamList] = useState([])
  const navigation = useNavigation();

  const {
    data: commentList,
    refetch: refetchCommentList,
    isFetching: commentListIsFetching,
  } = useFetch("/hr/employee-review/comment");
  const {data: personalCommentList, refetch: refetchPersonalCommentList, isFetching: personalCommentListIsFetching} = useFetch("/hr/performance-result/personal")
  const {data: teamCommentList, refetch: refetchTeamCommentList, isFetching: teamCommentListIsFetching} = useFetch('/hr/performance-result/my-team')

  if (commentList?.data.length > 0) {
    var tabs = useMemo(() => {
      return [
        { title: `Ongoing (${commentList?.data.length || 0})`, value: "Ongoing" },
        { title: `Personal (${personalCommentList?.data.length || 0})`, value: "Personal" },
        { title: `My Team (${teamCommentList?.data.length})`, value: "My Team" },
      ];
    }, [commentList, personalCommentList, teamCommentList]);
  } else if (commentList?.data.length === 0 && teamCommentList?.data.length > 0) {
    var tabs = useMemo(() => {
      return [
        { title: `Personal (${personalCommentList?.data.length || 0})`, value: "Personal" },
        { title: `My Team (${teamCommentList?.data.length || 0})`, value: "My Team" },
      ];
    }, [teamCommentList, personalCommentList]);
  } 
  else {
    var tabs = useMemo(() => {
      return [
        { title: `Personal (${personalCommentList?.data.length || 0})`, value: "Personal" },
      ];
    }, [personalCommentList]);
  }

  const [tabValue, setTabValue] = useState(commentList?.data.length > 0 ? "Ongoing" : "Personal");

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setOngoingList([])
    setPersonalList([])
    setTeamList([])
  }, []);

  useEffect(() => {
    if (commentList?.data.length) {
      setOngoingList((prevData) => [...prevData, ...commentList?.data])

    }
  }, [commentList?.data.length, tabValue])

  useEffect(() => {
    if (personalCommentList?.data.length) {
      setPersonalList((prevData) => [...prevData, ...personalCommentList?.data])

    }
  }, [personalCommentList?.data.length, tabValue])

  useEffect(() => {
    if (teamCommentList?.data.length) {
      setTeamList((prevData) => [...prevData, ...teamCommentList?.data])

    }
  }, [teamCommentList?.data.length, tabValue])

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Performance Result" backButton={false} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tabValue === "Ongoing" ? (
            ongoingList.length > 0 ?(
              <FlashList
                data={ongoingList}
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
                refreshControl={<RefreshControl refreshing={commentListIsFetching} onRefresh={refetchCommentList} />}
              />
            ) : 
            <ScrollView
              refreshControl={<RefreshControl refreshing={commentListIsFetching} onRefresh={refetchCommentList} />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          ) 
          : 
          tabValue === 'My Team' ?  (
            teamList.length > 0 ?
            (
              <FlashList
                data={teamList}
                estimatedItemSize={50}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <CommentListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.performance_review?.begin_date}
                  end_date={item?.performance_review?.end_date}
                  navigation={navigation}
                  name={item?.employee?.name}
                  target={null}
                  dayjs={dayjs}
                  description={item?.performance_review?.description}
                  type='my-team'
                  />
                )}
                refreshControl={<RefreshControl refreshing={teamCommentListIsFetching} onRefresh={refetchTeamCommentList} />}
              />
            )
            :
            <ScrollView
            refreshControl={<RefreshControl refreshing={teamCommentListIsFetching} onRefresh={refetchTeamCommentList} />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
) : personalList.length > 0 ?
(
  <FlashList
    data={personalList}
    estimatedItemSize={50}
    onEndReachedThreshold={0.1}
    keyExtractor={(item, index) => index}
    renderItem={({ item, index }) => (
      <CommentListItem
        key={index}
        id={item?.id}
        start_date={item?.performance_review?.begin_date}
        end_date={item?.performance_review?.end_date}
        navigation={navigation}
        name={item?.employee?.name}
        target={null}
        dayjs={dayjs}
        description={item?.performance_review?.description}
        type='personal'
      />
    )}
    refreshControl={<RefreshControl refreshing={personalCommentListIsFetching} onRefresh={refetchPersonalCommentList} />}
  />
)
        :
            <ScrollView
            refreshControl={<RefreshControl refreshing={personalCommentListIsFetching} onRefresh={refetchPersonalCommentList} />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
        }
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommentListScreen;

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
