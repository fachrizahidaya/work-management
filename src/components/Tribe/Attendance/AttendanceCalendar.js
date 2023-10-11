import React, { useState, Fragment, useCallback, useMemo, useRef, useEffect } from "react";
import dayjs from "dayjs";

import { StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { Flex, FormControl, Icon, Input, Modal, ScrollView, Select, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import testIDs from "../testIDs";
import { useDisclosure } from "../../../hooks/useDisclosure";
import FormButton from "../../shared/FormButton";

const AttendanceCalendar = ({ attendance, onMonthChange }) => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});

  const { isOpen: reportIsOpen, toggle: toggleReport } = useDisclosure(false);

  const INITIAL_DATE = dayjs().format("YYYY-MM-DD");

  const { height } = Dimensions.get("window");

  /**
   * Status attendance Handler
   */
  const allGood = { key: "allGood", color: "#EDEDED", name: "All Good" };
  const reportRequired = { key: "reportRequired", color: "#FDC500", name: "Report Required" };
  const submittedReport = { key: "submittedReport", color: "#186688", name: "Submitted Report" };
  const dayOff = { key: "dayOff", color: "#3bc14a", name: "Day-off" };
  const sick = { key: "sick", color: "black", name: "Sick" };

  const lateType = [
    { id: 1, name: "Late" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  const earlyType = [
    { id: 1, name: "Early" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  const listIcons = [
    { key: "allGood", color: "#EDEDED", name: "All Good" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off" },
    { key: "sick", color: "black", name: "Sick" },
  ];

  const handleMonthChange = (newMonth) => {
    onMonthChange(newMonth);
  };

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
            date: item?.date,
          },
        ];
      });

      setItems(dateList);
    }
  }, [attendance]);

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
        <Calendar
          onDayPress={toggleDateHandler}
          style={styles.calendar}
          current={INITIAL_DATE}
          markingType={"multi-dot"}
          markedDates={markedDates}
          onMonthChange={(date) => handleMonthChange(date)}
        />

        <Modal size="xl" isOpen={reportIsOpen} onClose={toggleReport}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>{dayjs(date?.date).format("dddd, DD MMM YYYY")}</Modal.Header>
            {date?.late && (
              <Modal.Body>
                <VStack
                  w="95%"
                  space={3}
                  // pb={keyboardHeight}
                >
                  <VStack w="100%" space={2}>
                    <FormControl
                    // isInvalid={formik.errors.leave_id}
                    >
                      <FormControl.Label>Late Type</FormControl.Label>
                    </FormControl>
                    <Select
                      // mt={-3}
                      // selectedValue={formik.values.leave_id}
                      // onValueChange={(value) => formik.setFieldValue("leave_id", value)}
                      borderRadius={15}
                      borderWidth={1}
                      variant="unstyled"
                      // key="leave_id"
                      placeholder="Select Late Type"
                      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    >
                      {lateType.map((item) => {
                        return <Select.Item label={item?.name} value={item?.id} key={item?.id} />;
                      })}
                    </Select>
                    <FormControl
                      mt={-2}
                      // isInvalid={formik.errors.leave_id}
                    >
                      {/* <FormControl.ErrorMessage>{formik.errors.leave_id}</FormControl.ErrorMessage> */}
                    </FormControl>
                    <FormControl.Label>Reason</FormControl.Label>

                    <FormControl
                    // isInvalid={formik.errors.password}
                    >
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        // value={formik.values.password}
                        // onChangeText={(value) => formik.setFieldValue("password", value)}
                      />
                      {/* <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage> */}
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            )}
            {date?.early && (
              <Modal.Body>
                <VStack
                  w="95%"
                  space={3}
                  // pb={keyboardHeight}
                >
                  <VStack w="100%" space={2}>
                    <FormControl
                    // isInvalid={formik.errors.leave_id}
                    >
                      <FormControl.Label>Early Type</FormControl.Label>
                    </FormControl>
                    <Select
                      // mt={-3}
                      // selectedValue={formik.values.leave_id}
                      // onValueChange={(value) => formik.setFieldValue("leave_id", value)}
                      borderRadius={15}
                      borderWidth={1}
                      variant="unstyled"
                      // key="leave_id"
                      placeholder="Select Early Type"
                      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    >
                      {earlyType.map((item) => {
                        return <Select.Item label={item?.name} value={item?.id} key={item?.id} />;
                      })}
                    </Select>
                    <FormControl
                      mt={-2}
                      // isInvalid={formik.errors.leave_id}
                    >
                      {/* <FormControl.ErrorMessage>{formik.errors.leave_id}</FormControl.ErrorMessage> */}
                    </FormControl>
                    <FormControl.Label>Reason</FormControl.Label>

                    <FormControl
                    // isInvalid={formik.errors.password}
                    >
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        // value={formik.values.password}
                        // onChangeText={(value) => formik.setFieldValue("password", value)}
                      />
                      {/* <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage> */}
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            )}

            <Modal.Footer>
              <FormButton color="muted.500" size="sm" variant="outline" onPress={toggleReport}>
                <Text color="white">Cancel</Text>
              </FormButton>
              <FormButton
                size="sm"
                variant="solid"
                // isSubmitting={formik.isSubmitting}
                // onPress={formik.handleSubmit}
              >
                <Text color="white">Save</Text>
              </FormButton>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
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
        <Flex alignItems="center" justifyContent="center" gap={1} px={3} flexDirection="row" flexWrap="wrap">
          {listIcons.slice(0, 4).map((item) => {
            return (
              <Flex flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
                <Icon as={<MaterialCommunityIcons name="circle" />} color={item.color} />
                <Text fontSize={12} fontWeight={500}>
                  {item.name}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </ScrollView>
    </>
  );
};

export default AttendanceCalendar;

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
