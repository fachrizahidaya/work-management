import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Agenda } from "react-native-calendars";
import { TouchableOpacity, StyleSheet, Text, Image, View } from "react-native";

import { TextProps } from "./CustomStylings";

const CalendarWithSlider = ({ items, colorDots }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const navigation = useNavigation();
  const today = dayjs().format("YYYY-MM-DD");

  const renderItem = (reservation) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          if (reservation.module === "Project") {
            navigation.navigate("Project Detail", {
              projectId: reservation.id,
            });
          } else if (reservation.module === "Task") {
            navigation.navigate("Task Detail", { taskId: reservation.id });
          }
        }}
      >
        <Text style={TextProps}>{reservation.description}</Text>
        <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 5 }} />
      </TouchableOpacity>
    );
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <>
      <Text style={[styles.monthLabel, TextProps]}>{dayjs(selectedDate).format("MMMM YYYY")}</Text>
      <Agenda
        markingType="custom"
        markedDates={colorDots}
        items={items}
        showClosingKnob={true}
        selected={today}
        renderItem={renderItem}
        theme={{
          selectedDayBackgroundColor: "#D5D5D5",
          selectedDayTextColor: "#000000",
          "stylesheet.calendar.header": {
            dayTextAtIndex0: { color: "#FF7272" },
            dayTextAtIndex6: { color: "#FF7272" },
          },
        }}
        renderEmptyData={() => {
          return (
            <>
              <View style={styles.container}>
                {/* <Image source={require("../../assets/vectors/items.jpg")} alt="empty" style={styles.image} /> */}
                <Text style={TextProps}>You have no agenda</Text>
              </View>
            </>
          );
        }}
        onDayPress={handleDayPress}
      />
    </>
  );
};

export default CalendarWithSlider;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
  },
  monthLabel: {
    textAlign: "center",
    fontSize: 18,
    padding: 10,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  emptyDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  emptyDataText: {
    fontSize: 16,
  },
  container: {
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "contain",
  },
});
