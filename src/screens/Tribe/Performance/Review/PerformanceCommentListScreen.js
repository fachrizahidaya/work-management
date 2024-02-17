import React, { useCallback, useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { FlashList } from '@shopify/flash-list';

import PageHeader from '../../../../components/shared/PageHeader'
import Tabs from '../../../../components/shared/Tabs'
import OngoingPerformanceCommentListItem from '../../../../components/Tribe/Performance/OngoingPerformance/OngoingPerformanceCommentListItem'
import EmptyPlaceholder from '../../../../components/shared/EmptyPlaceholder'
import { useFetch } from '../../../../hooks/useFetch'
import FormButton from '../../../../components/shared/FormButton';

const PerformanceCommentListScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const navigation = useNavigation();

  const {
    data: commentList,
    refetch: refetchCommentList,
    isFetching: commentListIsFetching,
  } = useFetch("/hr/employee-review/comment");

  

  const tabs = useMemo(() => {
    return [
      { title: `Ongoing (${commentList?.data.length || 0})`, value: "Ongoing" },
      { title: `Personal (${0})`, value: "Personal" },
      { title: `My Team (${0})`, value: "My Team" },
    ];
  }, [commentList]);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Performance Comment" backButton={false}  />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Comment Screen')}>
        <Text>click here</Text>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 16 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
       
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tabValue === "Ongoing" ? (
            <FlashList
              data={commentList?.data}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <OngoingPerformanceCommentListItem
                  key={index}
                  id={item?.id}
                  start_date={item?.performance_review?.begin_date}
                  end_date={item?.performance_review?.end_date}
                  // position={item?.target_level}
                  navigation={navigation}
                  name={item?.performance_review?.description}
                  type="kpi"
                  // target={item?.target_name}
                />
              )}
            />
          ) : (
            <ScrollView refreshControl={<RefreshControl refreshing={kpiListIsFetching} onRefresh={refetchKpiList} />}>
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PerformanceCommentListScreen

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