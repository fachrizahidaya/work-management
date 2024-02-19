import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'

import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { useFetch } from '../../../../hooks/useFetch'
import PageHeader from '../../../../components/shared/PageHeader'
import ConfirmedCommentDetailItem from '../../../../components/Tribe/Performance/CommentList/ConfirmedCommentDetailItem'
import ConfirmedCommentDetailList from '../../../../components/Tribe/Performance/CommentList/ConfirmedCommentDetailList';
import { card } from '../../../../styles/Card'
import { TextProps } from '../../../../components/shared/CustomStylings'

const AppraisalEmployeeScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {appraisal} = route.params;

  return (
    <>
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader
          width={200}
          title="Appraisal Result"
          backButton={true}
          onPress={() => {
           navigation.goBack()
          }}
        />
      </View>
     
      <View style={styles.container}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {
            appraisal.map((item,index) => {
                return (

      <View
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: 'column',
        gap: 5,
      }}
      id={index}
    >
        <Text>{item?.description}</Text>
        <Text>{item?.choice_text}</Text>
    </View>      
                )
            })
        }
    </ScrollView>
      </View>
    </SafeAreaView>
  </>
  )
}

export default AppraisalEmployeeScreen

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