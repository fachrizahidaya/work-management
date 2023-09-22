import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import { useState } from "react";
import axiosInstance from "../../config/api";
import { useEffect } from "react";
import dayjs from "dayjs";
import Schedule from "../../components/Tribe/Calendar/Schedule";

const AttendanceScreen = () => {
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get("/hr/timesheets/personal", {
        params: filter,
      });
      setAttendance(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filter]);

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
        <AttendanceCalendar attendance={attendance} />
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
