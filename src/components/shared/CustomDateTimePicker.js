import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Flex, Input } from "native-base";

/**
 * @param {number} width - The width of the component.
 * @param {Object} formik - The Formik form instance.
 * @param {string} fieldName - The name of the field in Formik.
 * @param {string} defaultValue - The default date value.
 * @param {boolean} disabled - Whether the component is disabled
 */
const CustomDateTimePicker = ({ width, formik, fieldName, defaultValue, disabled }) => {
  // State for the selected date and the displayed value
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState();

  // State to control the visibility of the date picker
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  // Toggle the date picker's visibility
  const toggleDatePicker = () => {
    setCalendarIsOpen(!calendarIsOpen);
  };

  // Handle date change
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setValue(formatDate(currentDate));
        formik.setFieldValue(fieldName, formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  // Confirm selected date for iOS
  const confirmIOSDate = () => {
    setValue(formatDate(date));
    toggleDatePicker();
    formik.setFieldValue(fieldName, formatDate(date));
  };

  // Format date as "YYYY-MM-DD"
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  // Set default value if provided
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    } else {
      setValue();
    }
  }, [defaultValue]);

  return (
    <>
      {!calendarIsOpen && (
        <Pressable onPress={toggleDatePicker} disabled={disabled}>
          <Input
            placeholder="DD/MM/YYYY"
            editable={false}
            value={value}
            onPressIn={toggleDatePicker}
            w={width}
            borderRadius={15}
            style={{ height: 40 }}
          />
        </Pressable>
      )}

      {calendarIsOpen && (
        <DateTimePicker
          mode="date"
          value={date}
          display="spinner"
          onChange={onChange}
          style={styles.datePicker}
          minimumDate={new Date(dayjs().format("YYYY-MM-DD"))}
        />
      )}

      {/* Cancel or Select date button for iOS */}
      {calendarIsOpen && Platform.OS === "ios" && (
        <Flex flexDir="row" gap={2} alignSelf="center">
          <Button onPress={toggleDatePicker} variant="outline">
            Cancel
          </Button>

          <Button onPress={confirmIOSDate}>Confirm</Button>
        </Flex>
      )}
    </>
  );
};

export default CustomDateTimePicker;

const styles = StyleSheet.create({
  datePicker: {
    height: 120,
    marginTop: -10,
  },
});
