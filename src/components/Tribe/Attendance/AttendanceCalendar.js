import React, { useState, Fragment, useCallback, useMemo, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";

import { StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { Flex, FormControl, Icon, Input, Modal, ScrollView, Select, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import testIDs from "../testIDs";
import FormButton from "../../shared/FormButton";

const AttendanceCalendar = ({ attendance, onMonthChange, onSubmit, reportIsOpen, toggleReport }) => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});

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
   * Late type Handler
   */
  const lateType = [
    { id: 1, name: "Late" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  /**
   * Early type Handler
   */
  const earlyType = [
    { id: 1, name: "Early" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  /**
   * List icon for Report status
   */
  const listIcons = [
    { key: "allGood", color: "#EDEDED", name: "All Good" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off" },
    { key: "sick", color: "#000000", name: "Sick" },
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
          if (
            item?.date &&
            item?.confirmation === 0 &&
            item?.attendanceType !== "Permit" &&
            item?.attendanceType !== "Leave"
          ) {
            toggleReport();
            setDate(item);
          }
        });
      }
    }
  };

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
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      onSubmit(date?.id, values, setSubmitting, setStatus);
      resetForm();
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

    // useEffect(() => {
    //   if (!formik.isSubmitting && formik.status === "success") {
    //     toggleReport(formik.resetForm);
    //   }
    // }, [formik.isSubmitting, formik.status]);

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

            {/* If employee Clock in late, require Late Report */}
            {date?.late && date?.lateType && !date?.lateReason && (
              <Modal.Body>
                <VStack
                  w="95%"
                  space={3}
                  // pb={keyboardHeight}
                >
                  <VStack w="100%" space={2}>
                    <FormControl isInvalid={formik.errors.late_type}>
                      <FormControl.Label>Late Type</FormControl.Label>
                    </FormControl>
                    <Select
                      onValueChange={(value) => formik.setFieldValue("late_type", value)}
                      borderRadius={15}
                      borderWidth={1}
                      variant="unstyled"
                      key="late_type"
                      placeholder="Select Late Type"
                      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    >
                      {lateType.map((item) => {
                        return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                      })}
                    </Select>
                    <FormControl mt={-2} isInvalid={formik.errors.late_type}>
                      <FormControl.ErrorMessage>{formik.errors.late_type}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl.Label>Reason</FormControl.Label>
                    <FormControl isInvalid={formik.errors.late_reason}>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.late_reason}
                        onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                      />
                      <FormControl.ErrorMessage>{formik.errors.late_reason}</FormControl.ErrorMessage>
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            )}

            {/* If employee Clock out early, require Early Report */}
            {date?.early && date?.earlyType && !date?.earlyReason && (
              <Modal.Body>
                <VStack
                  w="95%"
                  space={3}
                  // pb={keyboardHeight}
                >
                  <VStack w="100%" space={2}>
                    <FormControl isInvalid={formik.errors.early_type}>
                      <FormControl.Label>Early Type</FormControl.Label>
                    </FormControl>
                    <Select
                      onValueChange={(value) => formik.setFieldValue("early_type", value)}
                      borderRadius={15}
                      borderWidth={1}
                      variant="unstyled"
                      key="early_type"
                      placeholder="Select Early Type"
                      dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    >
                      {earlyType.map((item) => {
                        return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                      })}
                    </Select>
                    <FormControl mt={-2} isInvalid={formik.errors.early_type}>
                      <FormControl.ErrorMessage>{formik.errors.early_type}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl.Label>Reason</FormControl.Label>

                    <FormControl isInvalid={formik.errors.early_reason}>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.early_reason}
                        onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                      />
                      <FormControl.ErrorMessage>{formik.errors.early_reason}</FormControl.ErrorMessage>
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            )}

            {/* If report submitted either Late or Early */}
            {(date?.lateReason && !date?.earlyReason) || (!date?.lateReason && date?.earlyReason) ? (
              <Modal.Body>
                <VStack w="95%" space={3}>
                  <VStack w="100%" space={2}>
                    <FormControl>
                      <FormControl.Label>{date?.lateType ? "Late Type" : "Early Type"}</FormControl.Label>
                      <Text>{date?.lateType ? date?.lateType : date?.earlyType}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Text>{date?.lateReason ? date?.lateReason : date?.earlyReason}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Status</FormControl.Label>
                      <Text>{date?.lateStatus ? date?.lateStatus : date?.earlyStatus}</Text>
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            ) : /**
             * If report submitted  Late and Early
             */
            date?.lateType && date?.lateReason && date?.earlyType && date?.earlyReason ? (
              <Modal.Body>
                <VStack w="95%" space={3}>
                  <VStack w="100%" space={2}>
                    <FormControl>
                      <FormControl.Label>Late Type</FormControl.Label>
                      <Text>{date?.lateType}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Text>{date?.lateReason}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Status</FormControl.Label>
                      <Text>{date?.lateStatus}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Early Type</FormControl.Label>
                      <Text>{date?.earlyType}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Text>{date?.earlyReason}</Text>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Status</FormControl.Label>
                      <Text>{date?.earlyStatus}</Text>
                    </FormControl>
                  </VStack>
                </VStack>
              </Modal.Body>
            ) : null}

            <Modal.Footer>
              {(date?.lateType && date?.lateReason) || (date?.earlyType && date?.earlyReason) ? (
                <FormButton color="red.800" size="sm" variant="outline" onPress={toggleReport}>
                  <Text color="white">Close</Text>
                </FormButton>
              ) : (
                <>
                  <FormButton
                    color="red.800"
                    size="sm"
                    variant="outline"
                    onPress={() => {
                      toggleReport(formik.resetForm);
                    }}
                  >
                    <Text color="white">Cancel</Text>
                  </FormButton>
                  <FormButton
                    size="sm"
                    variant="solid"
                    isSubmitting={formik.isSubmitting}
                    onPress={formik.handleSubmit}
                  >
                    <Text color="white">Save</Text>
                  </FormButton>
                </>
              )}
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
