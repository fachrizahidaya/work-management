import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import Schedule from "../../components/Tribe/Calendar/Schedule";
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
import axiosInstance from "../../config/api";

const CalendarScreen = () => {
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
            <Text fontSize={16}>My Calendar</Text>
          </Flex>
        </Flex>
        <Schedule attendance={attendance} />
      </SafeAreaView>
    </>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
