import { useState, memo, useMemo, useCallback } from "react";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, useToast } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { useDisclosure } from "../../hooks/useDisclosure";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import useCheckAccess from "../../hooks/useCheckAccess";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });

  const updateAttendanceCheckAccess = useCheckAccess("update", "Attendance");

  const { isOpen: reportIsOpen, toggle: toggleReport } = useDisclosure(false);

  const toast = useToast();

  const attendanceFetchParameters = filter;

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  /**
   * Switch month handler
   */
  const handleMonthChange = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

  /**
   * Submit attendance report handler
   * @param {*} attendance_id
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const attendanceReportSubmitHandler = useCallback(async (attendance_id, data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/timesheets/personal/${attendance_id}`, data);
      toggleReport();
      refetchAttendanceData();
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Report Submitted"} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Submit failed, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader width={200} title="My Attendance" backButton={false} />
        </Flex>
        <ScrollView refreshControl={false}>
          <AttendanceCalendar
            attendance={attendanceData?.data}
            onMonthChange={handleMonthChange}
            onSubmit={attendanceReportSubmitHandler}
            reportIsOpen={reportIsOpen}
            toggleReport={toggleReport}
            updateAttendanceCheckAccess={updateAttendanceCheckAccess}
          />
        </ScrollView>
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
