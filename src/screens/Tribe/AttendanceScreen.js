import { useState } from "react";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Text, useToast } from "native-base";

import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { useDisclosure } from "../../hooks/useDisclosure";
import { SuccessToast } from "../../components/shared/ToastDialog";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });

  const { isOpen: reportIsOpen, toggle: toggleReport } = useDisclosure(false);

  const toast = useToast();

  const attendanceFetchParameters = filter;

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  const handleMonthChange = (newMonth) => {
    setFilter(newMonth);
  };

  /**
   * Submit attendance report handler
   * @param {*} attendance_id
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const attendanceReportSubmitHandler = async (attendance_id, data) => {
    try {
      const res = await axiosInstance.patch(`/hr/timesheets/personal/${attendance_id}`, data);
      toggleReport();
      toast.show({
        render: () => {
          return <SuccessToast message={"Report Submitted"} />;
        },
        placement: "top",
      });
      refetchAttendanceData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader width={200} title="My Attendance" backButton={false} />
        </Flex>
        <AttendanceCalendar
          attendance={attendanceData?.data}
          onMonthChange={handleMonthChange}
          onSubmit={attendanceReportSubmitHandler}
          reportIsOpen={reportIsOpen}
          toggleReport={toggleReport}
        />
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
