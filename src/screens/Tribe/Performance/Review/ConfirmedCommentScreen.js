import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'

import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { useFetch } from '../../../../hooks/useFetch'
import PageHeader from '../../../../components/shared/PageHeader'
import ConfirmedCommentDetailItem from '../../../../components/Tribe/Performance/CommentList/ConfirmedCommentDetailItem'
import ConfirmedCommentDetailList from '../../../../components/Tribe/Performance/CommentList/ConfirmedCommentDetailList'

const ConfirmedCommentScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {id, type} = route.params;

    const {data: comment} = useFetch(`/hr/performance-result/personal/${id}`)
    const {data: teamComment} = useFetch(`/hr/performance-result/my-team/${id}`)

  return (
  <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="Result"
            backButton={true}
            onPress={() => {
             navigation.goBack()
            }}
          />
        </View>
       
          <ConfirmedCommentDetailList
            dayjs={dayjs}
            begin_date={type === 'personal' ? comment?.data?.performance_review?.begin_date : teamComment?.data?.performance_review?.begin_date}
            end_date={type === 'personal' ? comment?.data?.performance_review?.end_date : teamComment?.data?.performance_review?.end_date}
            target={null}
            name={type === 'personal' ? null : teamComment?.data?.employee?.name}
            title={type === 'personal' ? comment?.data?.performance_review?.description : teamComment?.data?.performance_review?.description}
            type={type}
          />
          
        <View style={styles.container}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <ConfirmedCommentDetailItem grade={type === 'personal' ? comment?.data?.conclusion?.employee?.grade : teamComment?.data?.conclusion?.employee?.grade } subject='Employee' total_score={type === 'personal' ? comment?.data?.conclusion?.employee?.total_score : teamComment?.data?.conclusion?.employee?.total_score} employeeKPI={type === 'personal' ? comment?.data?.conclusion?.employee?.item[0] : teamComment?.data?.conclusion?.employee?.item[0]} supervisorKPI={type === 'personal' ? comment?.data?.conclusion?.supervisor?.item[0] : teamComment?.data?.conclusion?.supervisor?.item[0]} employeeAppraisal={null} supervisorAppraisal={null} appraisalData={null} navigation={navigation} />
        <ConfirmedCommentDetailItem id={type === 'personal' ? comment?.data?.comment?.id : teamComment?.data?.comment?.id} type={type} grade={type === 'personal' ? comment?.data?.conclusion?.supervisor?.grade : teamComment?.data?.conclusion?.supervisor?.grade} subject='Supervisor' total_score={type === 'personal' ? comment?.data?.conclusion?.supervisor?.total_score : teamComment?.data?.conclusion?.supervisor?.total_score} employeeKPI={null} supervisorKPI={null} employeeAppraisal={type === 'personal' ? comment?.data?.conclusion?.employee?.item[1] : teamComment?.data?.conclusion?.employee?.item[1]} supervisorAppraisal={type === 'personal' ? comment?.data?.conclusion?.supervisor?.item[1] : teamComment?.data?.conclusion?.supervisor?.item[1]} navigation={navigation}  />
        </ScrollView>
        </View>
      </SafeAreaView>
    </>
  )
}

export default ConfirmedCommentScreen

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
  });