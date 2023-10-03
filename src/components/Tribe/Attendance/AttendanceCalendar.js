import React, { useState, Fragment, useCallback, useMemo, useRef, useEffect } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, ScrollView } from "native-base";

import { Calendar, CalendarUtils } from "react-native-calendars";
import dayjs from "dayjs";

import testIDs from "../testIDs";

const AttendanceCalendar = ({ attendance }) => {
  const INITIAL_DATE = dayjs().format("YYYY-MM-DD");
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [items, setItems] = useState({});

  const allGood = { key: "allGood", color: "#ededed" };
  const reportRequired = { key: "reportRequired", color: "#fdc500" };
  const submittedReport = { key: "submittedReport", color: "#186688" };
  const dayOff = { key: "dayOff", color: "#3bc14a" };
  const sick = { key: "sick", color: "black" };

  const getDate = (count) => {
    const date = dayjs(INITIAL_DATE);
    const newDate = date.add(count, "day");
    return newDate.format("YYYY-MM-DD");
  };

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: "red",
        marked: true,
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "orange",
        selectedTextColor: "red",
      },
    };
  }, [selected]);

  useEffect(() => {
    if (attendance && attendance.length > 0) {
      let dateList = {};

      attendance.forEach((item) => {
        dateList[item?.date] = [
          {
            attendanceReason: item?.att_reason,
            attendanceType: item?.att_type,
            timeIn: item?.time_in,
            late: item?.late,
            lateReason: item?.late_reason,
            lateType: item?.late_type,
            dayType: item?.day_type,
            timeOut: item?.time_out,
            early: item?.early,
            earlyReason: item?.early_reason,
            earlyType: item?.early_type,
            confirmation: item?.confirm,
          },
        ];
      });

      setItems(dateList);
    }
  }, [attendance]);

  const renderCalendarWithMultiDotMarking = () => {
    const markedDates = {};
    for (const date in items) {
      if (items.hasOwnProperty(date)) {
        const events = items[date];
        const dots = [];
        events.forEach((event) => {
          let dotColor = "";

          if (event.dayType === "Weekend") {
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
          } else if (event?.attendanceType === "Sick") {
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
        <Calendar style={styles.calendar} current={INITIAL_DATE} markingType={"multi-dot"} markedDates={markedDates} />
      </Fragment>
    );
  };

  const customHeaderProps = useRef();

  const setCustomHeaderNewMonth = (next = false) => {
    const add = next ? 1 : -1;
    const month = new Date(customHeaderProps?.current?.month);
    const newMonth = new Date(month.setMonth(month.getMonth() + add));
    customHeaderProps?.current?.addMonth(add);
    setCurrentMonth(newMonth.toISOString().split("T")[0]);
  };
  const moveNext = () => {
    setCustomHeaderNewMonth(true);
  };
  const movePrevious = () => {
    setCustomHeaderNewMonth(false);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
        <Fragment>{renderCalendarWithMultiDotMarking()}</Fragment>
      </ScrollView>
    </>
  );
};

export default AttendanceCalendar;

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  switchText: {
    margin: 10,
    fontSize: 16,
  },
  text: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "lightgrey",
    fontSize: 16,
  },
  disabledText: {
    color: "grey",
  },
  defaultText: {
    color: "purple",
  },
  customCalendar: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  customDay: {
    textAlign: "center",
  },
  customHeader: {
    backgroundColor: "#FCC",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: -4,
    padding: 8,
  },
  customTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00BBF2",
  },
});
