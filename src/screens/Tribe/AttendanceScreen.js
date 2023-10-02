import { useState } from "react";

import dayjs from "dayjs";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Text } from "native-base";

import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import { useFetch } from "../../hooks/useFetch";
import Schedule from "../../components/Tribe/Calendar/Schedule";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], filter);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Attendance Log</Text>
          </Flex>
          <Text fontWeight={700} fontSize={12}>
            PT Kolabora Group Indonesia
          </Text>
        </Flex>
        <AttendanceCalendar attendance={attendanceData?.data} />
        {/* <Schedule/> */}
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
