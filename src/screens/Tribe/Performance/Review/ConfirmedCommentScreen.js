import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useFetch } from '../../../../hooks/useFetch'
import Button from '../../../../components/shared/Forms/Button'
import PageHeader from '../../../../components/shared/PageHeader'
import CommentDetailList from '../../../../components/Tribe/Performance/CommentList/CommentDetailList'
import CommentDetailItem from '../../../../components/Tribe/Performance/CommentList/CommentDetailItem'
import ConfirmedCommentDetailItem from '../../../../components/Tribe/Performance/CommentList/ConfirmedCommentDetailItem'

const ConfirmedCommentScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {id} = route.params;

    const {data: comment} = useFetch(`/hr/performance-result/personal/${id}`)

  return (
  <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="Comment"
            backButton={true}
            onPress={() => {
             navigation.goBack()
            }}
          />

          
        </View>
        <CommentDetailList
          dayjs={dayjs}
          begin_date={comment?.data?.performance_review?.begin_date}
          end_date={comment?.data?.performance_review?.end_date}
          target={null}
          name={null}
          title={comment?.data?.performance_review?.description}
        />
        <View style={styles.container}>
        <ConfirmedCommentDetailItem/>
        <ConfirmedCommentDetailItem/>
          {/* <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {commentValues &&
              commentValues.length > 0 &&
              commentValues.map((item, index) => {
                const correspondingEmployeeComment = employeeCommentValue.find(
                  (empComment) => empComment.id === item.id
                );
                return (
                  
                );
              })}
          </ScrollView> */}
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