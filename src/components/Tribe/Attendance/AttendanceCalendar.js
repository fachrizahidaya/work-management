import React, { useState, Fragment, useCallback, useMemo, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, ScrollView } from "native-base";
import { Calendar, CalendarUtils } from "react-native-calendars";
import testIDs from "../testIDs";
import dayjs from "dayjs";

const INITIAL_DATE = dayjs().format("YYYY-MM-DD");

const AttendanceCalendar = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

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

  const renderCalendarWithMultiDotMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with multi-dot marking</Text>
        <Calendar
          style={styles.calendar}
          current={INITIAL_DATE}
          markingType={"multi-dot"}
          markedDates={{
            [getDate(2)]: {
              selected: true,
              dots: [
                { key: "vacation", color: "blue", selectedDotColor: "red" },
                { key: "massage", color: "red", selectedDotColor: "white" },
              ],
            },
            [getDate(3)]: {
              disabled: true,
              dots: [
                { key: "vacation", color: "green", selectedDotColor: "red" },
                { key: "massage", color: "red", selectedDotColor: "green" },
              ],
            },
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithMultiPeriodMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with multi-period marking</Text>
        <Calendar
          style={styles.calendar}
          current={INITIAL_DATE}
          markingType={"multi-period"}
          markedDates={{
            [INITIAL_DATE]: {
              periods: [
                { startingDay: true, endingDay: false, color: "green" },
                { startingDay: true, endingDay: false, color: "orange" },
              ],
            },
            [getDate(1)]: {
              periods: [
                { startingDay: false, endingDay: true, color: "green" },
                { startingDay: false, endingDay: true, color: "orange" },
                { startingDay: true, endingDay: false, color: "pink" },
              ],
            },
            [getDate(3)]: {
              periods: [
                { startingDay: true, endingDay: true, color: "orange" },
                { color: "transparent" },
                { startingDay: false, endingDay: false, color: "pink" },
              ],
            },
          }}
        />
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
        <Fragment>
          {renderCalendarWithMultiDotMarking()}
          {renderCalendarWithMultiPeriodMarking()}
        </Fragment>
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
