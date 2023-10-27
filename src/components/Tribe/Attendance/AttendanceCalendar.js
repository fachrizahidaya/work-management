import React, { useState, Fragment, useEffect, memo, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { useFormik } from "formik";

import { StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

import AttendanceModal from "./AttendanceModal";
import AttendanceIcon from "./AttendanceIcon";

const AttendanceCalendar = ({
  attendance,
  onMonthChange,
  onSubmit,
  reportIsOpen,
  toggleReport,
  updateAttendanceCheckAccess,
}) => {
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});

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

  /**
   * Month change handler
   * @param {*} newMonth
   */
  const handleMonthChange = (newMonth) => {
    onMonthChange(newMonth);
  };

  /**
   *
   * Input date to Calendar Handler
   */

  useEffect(() => {
    if (attendance && attendance.length > 0) {
      let dateList = {};

      attendance.forEach((item) => {
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
  }, [attendance]);

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
          if (item?.date && item?.confirmation === 0) {
            toggleReport();
            setDate(item);
          }
        });
      }
    }
  };

  /**
   * Create attendance report handler
   */

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      late_type: date?.lateType || "",
      late_reason: date?.lateReason || "",
      early_type: date?.earlyType || "",
      early_reason: date?.earlyReason || "",
      att_type: date?.attendanceType || "",
      att_reason: date?.attendanceReason || "",
    },
    // validationSchema: yup.object().shape({}),
    onSubmit: (values, { resetForm }) => {
      onSubmit(date?.id, values);
      // resetForm();
    },
  });

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
            event.dayType === "Weekend" ||
            (event?.attendanceType === "Leave" && event?.dayType === "Work Day") ||
            (event?.attendanceType === "Permit" && event?.dayType === "Work Day")
          ) {
            dotColor = dayOff.color;
          } else if (
            (event?.early && !event?.earlyReason && !event?.confirmation) ||
            (event?.late && !event?.lateReason && !event?.confirmation) ||
            (event?.attendanceType === "Alpa" && !event?.attendanceReason)
          ) {
            dotColor = reportRequired.color;
          } else if (
            (event?.early && event?.earlyReason && !event?.confirmation) ||
            (event?.late && event?.lateReason && !event?.confirmation) ||
            (event?.attendanceType !== "Alpa" && event?.attendanceReason)
          ) {
            dotColor = submittedReport.color;
          } else if (event?.attendanceType === "Sick" || event?.attendanceType === "Leave") {
            dotColor = sick.color;
          } else if (
            (event?.confirmation && event?.dayType !== "Weekend") ||
            (!event?.confirmation && event?.dayType !== "Weekend")
          ) {
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
          onDayPress={toggleDateHandler}
          style={styles.calendar}
          current={INITIAL_DATE}
          markingType={"multi-dot"}
          markedDates={markedDates}
          onMonthChange={(date) => handleMonthChange(date)}
        />
        <AttendanceModal
          reportIsOpen={reportIsOpen}
          toggleReport={toggleReport}
          date={date}
          formik={formik}
          updateAttendanceCheckAccess={updateAttendanceCheckAccess}
        />
      </Fragment>
    );
  };

  return (
    <>
      <Fragment>{renderCalendarWithMultiDotMarking()}</Fragment>
      <AttendanceIcon />
    </>
  );
};

export default // memo
// (
AttendanceCalendar;
//   );

const styles = StyleSheet.create({
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
