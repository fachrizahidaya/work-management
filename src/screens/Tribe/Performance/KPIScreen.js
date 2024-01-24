import React, { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import ActionSheet from "react-native-actions-sheet";

import PageHeader from "../../../components/shared/PageHeader";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import { TextProps } from "../../../components/shared/CustomStylings";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import PerformanceForm from "../../../components/Tribe/Performance/PerformanceForm";

const KPIScreen = () => {
  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);

  const questionData = {
    id: 1,
    year: 2024,
    period: 3,
    type: "KPI",
    status: "Pending",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    position: { position_name: "Mobile Developer" },
    division: "Tech",
    questions: [
      {
        title: "Manpower Fulfillment as per MPP Approval & Request",
        actual: 0,
        target: 100,
        threshold: 10,
        weight: 0.3,
      },
      {
        title: "Feedback Rating For The Townhall Event has been held",
        actual: 0,
        target: 100,
        threshold: 10,
        weight: 0.3,
      },
      {
        title: "Employee Workshop (3 times in a year)",
        actual: 0,
        target: 100,
        threshold: 10,
        weight: 0.4,
      },
    ],
  };

  const exampleQuestion = questionData.questions.slice(0, 1).map((item, index) => ({
    title: item.title,
    actual: item.actual,
    target: item.target,
    threshold: item.threshold,
    weight: item.weight,
  }));

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => navigation.goBack()} />
          <Pressable>
            <Text>Done</Text>
          </Pressable>
        </View>
        <KPIDetailList dayjs={dayjs} question={questionData} />

        <View style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <FlashList
              data={questionData.questions}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <KPIDetailItem
                  question={item?.title}
                  actual={item?.actual}
                  target={item?.target}
                  navigation={navigation}
                  reference={formScreenSheetRef}
                />
              )}
            />
          </View>
        </View>
      </SafeAreaView>
      <PerformanceForm reference={formScreenSheetRef} data={exampleQuestion} />
    </>
  );
};

export default KPIScreen;

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
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
