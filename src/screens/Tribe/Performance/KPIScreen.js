import React, { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../../components/shared/PageHeader";
import Tabs from "../../../components/shared/Tabs";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import { TextProps } from "../../../components/shared/CustomStylings";

const KPIScreen = () => {
  const [tabValue, setTabValue] = useState("Ongoing");
  const [ongoingList, setOngoingList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [
      { title: "Ongoing", value: "Ongoing" },
      { title: "Archived", value: "Archived" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setOngoingList([]);
    setArchivedList([]);
  }, []);

  const questionData = [
    {
      id: 1,
      year: 2024,
      period: 3,
      type: "KPI",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      position: [
        {
          id: 1,
          position_name: "Front-End Developer",
        },
        { id: 2, position_name: "Mobile Developer" },
        { id: 3, position_name: "Back-End Developer" },
      ],
      division: "Tech",
      questions: [
        {
          title: "Manpower Fulfillment as per MPP Approval & Request",
          achievement: [
            {
              name: "actual",
              value: 0,
            },
            {
              name: "actual",
              value: 0,
            },
          ],
        },
        {
          title: "Feedback Rating For The Townhall Event has been held",
          achievement: [
            {
              name: "actual",
              value: 0,
            },
            {
              name: "actual",
              value: 0,
            },
          ],
        },
        {
          title: "Employee Workshop (3 times in a year)",
          achievement: [
            {
              name: "actual",
              value: 0,
            },
            {
              name: "actual",
              value: 0,
            },
          ],
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={styles.header}>
        <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => navigation.goBack()} />
      </View>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: "#E2E2E2",
        }}
      >
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              style={[
                {
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 15,
                  textAlign: "center",
                },
                TextProps,
              ]}
            >
              Pending
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs("2024-07-01").format("DD MMM YYYY")} to</Text>
              <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs("2024-09-30").format("DD MMM YYYY")}</Text>
            </View>
          </View>
          <View>
            <Text style={[{ opacity: 0.5 }, TextProps]}>Position</Text>
            <Text style={[TextProps]}>Front End Developer</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <FlashList
            data={questionData}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => <KPIDetailItem question={item?.questions} navigation={navigation} />}
          />
        </View>
      </View>
    </SafeAreaView>
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
