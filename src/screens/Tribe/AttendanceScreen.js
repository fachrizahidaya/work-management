import { useState, memo, useMemo, useCallback } from "react";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, useToast } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { useDisclosure } from "../../hooks/useDisclosure";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import useCheckAccess from "../../hooks/useCheckAccess";
import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import AttendanceModal from "../../components/Tribe/Attendance/AttendanceModal";
import { useEffect } from "react";
import { Fragment } from "react";
import { Calendar } from "react-native-calendars";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});

  const updateAttendanceCheckAccess = useCheckAccess("update", "Attendance");

  const { isOpen: reportIsOpen, toggle: toggleReport } = useDisclosure(false);

  const toast = useToast();

  const attendanceFetchParameters = filter;

  // initial date handler
  const INITIAL_DATE = dayjs().format("YYYY-MM-DD");

  /**
   * Status attendance Handler
   */
  const allGood = { key: "allGood", color: "#EDEDED", name: "All Good" };
  const reportRequired = { key: "reportRequired", color: "#FDC500", name: "Report Required" };
  const submittedReport = { key: "submittedReport", color: "#186688", name: "Submitted Report" };
  const dayOff = { key: "dayOff", color: "#3bc14a", name: "Day-off" };
  const sick = { key: "sick", color: "#000000", name: "Sick" };

  const isWorkDay = date?.dayType === "Work Day";
  const hasClockInAndOut =
    isWorkDay &&
    !date?.lateType &&
    !date?.earlyType &&
    (date?.attendanceType !== "Permit" || date?.attendanceType !== "Leave");
  const hasLateWithoutReason = date?.late && date?.lateType && !date?.lateReason;
  const hasEarlyWithoutReason = date?.early && date?.earlyType && !date?.earlyReason;
  const hasSubmittedReport = (date?.lateReason && !date?.earlyReason) || (date?.earlyReason && !date?.lateReason);
  const hasSubmittedBothReports = date?.lateReason && date?.earlyReason;
  const isLeave = date?.attendanceType === "Work Day" && date?.attendanceType === "Leave";
  const isPermit = date?.attendanceType === "Work Day" && date?.attendanceType === "Permit";

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  /**
   * Switch month handler
   */
  const switchMonthHandler = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

  useEffect(() => {
    if (attendanceData?.data && attendanceData?.data.length > 0) {
      let dateList = {};

      attendanceData?.data.forEach((item) => {
        dateList[item?.date] = [
          {
            id: item?.id,
            attendanceReason: item?.att_reason,
            attendanceType: item?.att_type,
            timeIn: item?.time_in,
            late: item?.late,
            lateReason: item?.late_reason,
            lateType: item?.late_type,
            lateStatus: item?.late_status,
            dayType: item?.day_type,
            timeOut: item?.time_out,
            early: item?.early,
            earlyReason: item?.early_reason,
            earlyType: item?.early_type,
            earlyStatus: item?.early_status,
            confirmation: item?.confirm,
            date: item?.date,
          },
        ];
      });

      setItems(dateList);
    }
  }, [attendanceData?.data]);

  /**
   * Toggle date Handler
   * @param {*} day
   */
  const toggleDateHandler = (day) => {
    if (day) {
      const selectedDate = day.dateString;
      const dateData = items[selectedDate];
      if (dateData && dateData.length > 0) {
        dateData.map((item) => {
          if (item?.date && item?.confirmation === 0 && item?.dayType !== "Weekend") {
            toggleReport();
            setDate(item);
          }
        });
      }
    }
  };

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

  /**
   * Month change handler
   * @param {*} newMonth
   */
  const handleMonthChange = (newMonth) => {
    switchMonthHandler(newMonth);
  };

  /**
   * Marked dates in Calendar Handler
   * @returns
   */
  const renderCalendarWithMultiDotMarking = () => {
    const markedDates = {};
    for (const date in items) {
      if (items.hasOwnProperty(date)) {
        const events = items[date];
        const dots = [];
        events.forEach((event) => {
          let dotColor = "";

          if (
            (event?.dayType === "Work Day" && event?.attendanceType === "Leave" && event?.dayType === "Work Day") ||
            (event?.dayType === "Work Day" && event?.attendanceType === "Permit" && event?.dayType === "Work Day")
          ) {
            dotColor = dayOff.color;
          } else if (
            (event?.dayType === "Work Day" && event?.early && !event?.earlyReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.late && !event?.lateReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.attendanceType === "Alpa" && !event?.attendanceReason)
          ) {
            dotColor = reportRequired.color;
          } else if (
            (event?.dayType === "Work Day" && event?.early && event?.earlyReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.late && event?.lateReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.attendanceType !== "Alpa" && event?.attendanceReason)
          ) {
            dotColor = submittedReport.color;
          } else if (
            (event?.dayType === "Work Day" && event?.attendanceType === "Sick") ||
            event?.attendanceType === "Leave"
          ) {
            dotColor = sick.color;
          } else if (event?.confirmation && event?.dayType !== "Weekend") {
            dotColor = allGood.color;
          }
          dots.push({
            key: event.name,
            color: dotColor,
          });
        });
        markedDates[date] = { dots };
      }
    }

    return (
      <Fragment>
        <Calendar
          onDayPress={updateAttendanceCheckAccess && toggleDateHandler}
          style={styles.calendar}
          current={INITIAL_DATE}
          markingType={"multi-dot"}
          markedDates={markedDates}
          onMonthChange={(date) => handleMonthChange(date)}
        />
      </Fragment>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader width={200} title="My Attendance" backButton={false} />
        </Flex>
        <ScrollView refreshControl={false}>
          <AttendanceCalendar
            attendance={attendanceData?.data}
            onMonthChange={switchMonthHandler}
            onSubmit={attendanceReportSubmitHandler}
            reportIsOpen={reportIsOpen}
            toggleReport={toggleReport}
            updateAttendanceCheckAccess={updateAttendanceCheckAccess}
            onSelectDate={toggleDateHandler}
            items={items}
            renderCalendar={renderCalendarWithMultiDotMarking}
          />
        </ScrollView>
      </SafeAreaView>
      <AttendanceModal
        reportIsOpen={reportIsOpen}
        toggleReport={toggleReport}
        date={date}
        onSubmit={attendanceReportSubmitHandler}
        hasClockInAndOut={hasClockInAndOut}
        hasLateWithoutReason={hasLateWithoutReason}
        hasEarlyWithoutReason={hasEarlyWithoutReason}
        hasSubmittedReport={hasSubmittedReport}
        hasSubmittedBothReports={hasSubmittedBothReports}
        isLeave={isLeave}
        isPermit={isPermit}
      />
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
  calendar: {
    marginBottom: 10,
  },

  text: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "lightgrey",
    fontSize: 16,
  },

  customHeader: {
    backgroundColor: "#FCC",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: -4,
    padding: 8,
  },

  customTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00BBF2",
  },
});
