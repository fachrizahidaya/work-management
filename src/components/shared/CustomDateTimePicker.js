import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Flex, Icon, Input, Text, Pressable, Box } from "native-base";

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
            <Icon
              disabled={disabled}
              onPressIn={toggleDatePicker}
              as={iconType}
              name={iconName}
              size={30}
              color={iconColor}
            />
          ) : withText ? (
            <Text fontSize={fontSize} underline onPress={toggleDatePicker}>
              {textLabel}
            </Text>
          ) : (
            <Box position="relative">
              <Pressable
                position="absolute"
                zIndex={2}
                top={0}
                right={0}
                bottom={0}
                left={0}
                onPress={toggleDatePicker}
              />
              <Input
                ref={inputRef}
                isDisabled={disabled}
                isReadOnly
                placeholder="DD/MM/YYYY"
                editable={false}
                value={value}
                height={height}
                w={width}
                onTouchStart={() => inputRef.current.blur()}
              />
            </Box>
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
          minimumDate={new Date(dayjs().format("YYYY-MM-DD"))}
          maximumDate={maximumDate && new Date(maximumDate)}
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
