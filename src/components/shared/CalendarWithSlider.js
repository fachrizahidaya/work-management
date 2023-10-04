import { useState } from "react";

import { Agenda } from "react-native-calendars";
import dayjs from "dayjs";

import { Image, Text, VStack, View } from "native-base";
import { TouchableOpacity, StyleSheet, Alert } from "react-native";

const CalendarWithSlider = ({ selectedDate }) => {
  const [items, setItems] = useState({});
  //   date format is YYYY-MM-DD
  const dateConverter = dayjs().format(selectedDate);

  const date = {
    ["2023-10-01"]: [
      { name: "Task", time: "09:00", description: "Deadline task", height: 200 },
      { name: "Project", time: "10:00", description: "Deadline project", height: 200 },
    ],
    ["2023-10-02"]: [
      { name: "Task", time: "09:00", description: "Deadline task", height: 200 },
      { name: "Project", time: "10:00", description: "Deadline project", height: 200 },
    ],
  };

  const renderItem = (reservation) => {
    return (
      <TouchableOpacity
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text>{reservation.name}</Text>
        <Text>{reservation.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Agenda
      items={date}
      showClosingKnob={true}
      renderItem={renderItem}
      theme={{
        agendaTodayColor: "red",
        selectedDayTextColor: "white",
        selectedDayBackgroundColor: "#176688",
      }}
      renderEmptyData={() => {
        return (
          <VStack space={2} alignItems="center" justifyContent="center" height="100%" bgColor="white">
            <Image
              source={require("../../assets/vectors/items.jpg")}
              h={200}
              w={200}
              alt="empty"
              resizeMode="contain"
            />
            <Text>You have no tasks.</Text>
          </VStack>
        );
      }}
    />
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
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});
