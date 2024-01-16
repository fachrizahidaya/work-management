import React, { useEffect, useRef, useState } from "react";

import dayjs from "dayjs";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "./Forms/Input";
import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";

/**
 * @param {number} width - The width of the component.
 * @param {Object} formik - The Formik form instance.
 * @param {string} fieldName - The name of the field in Formik.
 * @param {string} defaultValue - The default date value.
 * @param {boolean} disabled - Whether the component is disabled
 */
const CustomDateTimePicker = ({
  width,
  height,
  onChange,
  defaultValue,
  disabled,
  maximumDate = null,
  withIcon,
  withText,
  iconName,
  iconType,
  iconColor,
  textLabel,
  fontSize,
  unlimitStartDate,
}) => {
  const inputRef = useRef(null);
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
  const onChangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setValue(formatDate(currentDate));
        onChange(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  // Confirm selected date for iOS
  const confirmIOSDate = () => {
    setValue(formatDate(date));
    toggleDatePicker();
    onChange(formatDate(date));
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

  /**
   * Handler for Attendance Attachment datepicker
   */
  const currentMonthStart = dayjs("2020-01-01");
  const unlimitMinimumDate = currentMonthStart.startOf("month").toDate();

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
        <>
          {withIcon ? (
            <Pressable disabled={disabled} onPress={toggleDatePicker}>
              <MaterialCommunityIcons as={iconType} name={iconName} size={30} color={iconColor || "#3F434A"} />
            </Pressable>
          ) : withText ? (
            <Pressable onPress={toggleDatePicker} disabled={disabled}>
              <Text style={{ fontSize: fontSize, textDecorationLine: "underline" }} fontSize={fontSize} underline>
                {textLabel}
              </Text>
            </Pressable>
          ) : (
            <View style={{ position: "relative" }}>
              <Pressable
                disabled={disabled}
                onPress={toggleDatePicker}
                style={{ position: "absolute", zIndex: 2, top: 0, right: 0, bottom: 0, left: 0 }}
              />
              <Input
                innerRef={inputRef}
                placeHolder="DD/MM/YYYY"
                value={value}
                height={height}
                width={width}
                onTouchStart={() => inputRef.current.blur()}
                editable={disabled ? false : true}
              />
            </View>
          )}
        </>
      )}

      {calendarIsOpen && (
        <DateTimePicker
          mode="date"
          value={date}
          display="spinner"
          onChange={onChangeDate}
          style={styles.datePicker}
          minimumDate={unlimitStartDate ? unlimitMinimumDate : new Date(dayjs().format("YYYY-MM-DD"))}
          maximumDate={maximumDate && new Date(maximumDate)}
        />
      )}

      {/* Cancel or Select date button for iOS */}
      {calendarIsOpen && Platform.OS === "ios" && (
        <View style={{ display: "flex", flexDirection: "row", gap: 5, alignSelf: "center" }}>
          <Button onPress={toggleDatePicker} variant="outline" styles={{ paddingHorizontal: 8 }}>
            <Text style={TextProps}>Cancel</Text>
          </Button>

          <Button onPress={confirmIOSDate} styles={{ paddingHorizontal: 8 }}>
            <Text style={{ color: "white" }}>Confirm</Text>
          </Button>
        </View>
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
