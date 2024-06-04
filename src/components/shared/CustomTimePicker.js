import { useEffect, useRef, useState } from "react";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "./Forms/Input";
import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";
const CustomTimePicker = ({
  width,
  height,
  onChange,
  defaultValue,
  disabled,
  withIcon,
  withText,
  iconName,
  iconType,
  iconColor,
  textLabel,
  fontSize,
  title,
  marginLeft,
}) => {
  const inputRef = useRef(null);
  // State for the selected date and the displayed value
  const [time, setTime] = useState(new Date());
  const [value, setValue] = useState();

  // State to control the visibility of the time picker
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  // Toggle the time picker's visibility
  const toggleDatePicker = () => {
    setCalendarIsOpen(!calendarIsOpen);
  };

  // Handle time change
  const onChangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setTime(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setValue(formatDate(currentDate));
        onChange(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  // Confirm selected time for iOS
  const confirmIOSDate = () => {
    setValue(formatDate(time));
    toggleDatePicker();
    onChange(formatDate(time));
  };

  // Format time as "YYYY-MM-DD"
  const formatDate = (rawDate) => {
    let time = new Date(rawDate);

    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();

    return `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${
      second < 10 ? "0" + second : second
    }`;
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
                placeHolder="HH:mm"
                value={value}
                height={height}
                width={width}
                onTouchStart={() => inputRef.current.blur()}
                editable={disabled ? false : true}
                title={title}
              />
            </View>
          )}
        </>
      )}

      {calendarIsOpen && (
        <DateTimePicker
          mode="time"
          is24Hour={true}
          value={time}
          display="spinner"
          onChange={onChangeDate}
          style={[styles.datePicker, { marginLeft: marginLeft }]}
          themeVariant="light"
        />
      )}

      {/* Cancel or Select time button for iOS */}
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

export default CustomTimePicker;

const styles = StyleSheet.create({
  datePicker: {
    height: 120,
    marginTop: -10,
  },
});
