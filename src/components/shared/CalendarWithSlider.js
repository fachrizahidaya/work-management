import { Agenda } from "react-native-calendars";

import dayjs from "dayjs";

import { Image, Text, VStack } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";

const CalendarWithSlider = ({ items }) => {
  const today = dayjs().format("YYYY-MM-DD");
  const renderItem = (reservation) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Text>{reservation.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
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
          <VStack space={2} alignItems="center" justifyContent="center" height="100%" bgColor="white">
            <Image
              source={require("../../assets/vectors/items.jpg")}
              h={200}
              w={200}
              alt="empty"
              resizeMode="contain"
            />
            <Text>You have no agenda</Text>
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
    justifyContent: "center",
  },
});
