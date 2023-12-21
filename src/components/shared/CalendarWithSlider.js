import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Agenda } from "react-native-calendars";
import dayjs from "dayjs";

import { TouchableOpacity, StyleSheet, Text, Image, View } from "react-native";

const CalendarWithSlider = ({ items }) => {
  const navigation = useNavigation();
  const today = dayjs().format("YYYY-MM-DD");
  const renderItem = (reservation) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          if (reservation.module === "Project") {
            navigation.navigate("Project Detail", { projectId: reservation.id });
          } else if (reservation.module === "Task") {
            navigation.navigate("Task Detail", { taskId: reservation.id });
          }
        }}
      >
        <Text>{reservation.description}</Text>
      </TouchableOpacity>
    );
  };

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <>
      <Text style={styles.monthLabel}>{dayjs(selectedDate).format("MMMM YYYY")}</Text>
      <Agenda
        items={items}
        showClosingKnob={true}
        selected={today}
        renderItem={renderItem}
        theme={{
          selectedDayTextColor: "white",
          selectedDayBackgroundColor: "#176688",
          todayTextColor: "#176688",
        }}
        renderEmptyData={() => {
          return (
            <>
              <View style={styles.container}>
                <Image source={require("../../assets/vectors/items.jpg")} alt="empty" style={styles.image} />
                <Text>You have no agenda</Text>
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
