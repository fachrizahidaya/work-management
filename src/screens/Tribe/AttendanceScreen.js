import { useState } from "react";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Text } from "native-base";

import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import { useFetch } from "../../hooks/useFetch";
import Schedule from "../../components/Tribe/Calendar/Schedule";
import PageHeader from "../../components/shared/PageHeader";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });

  const attendanceFetchParameters = filter;

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  const handleMonthChange = (newMonth) => {
    setFilter(newMonth);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <PageHeader title="My Attendance History" backButton={false} />
        </Flex>
        <AttendanceCalendar attendance={attendanceData?.data} onMonthChange={handleMonthChange} />
      </SafeAreaView>
    </>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
