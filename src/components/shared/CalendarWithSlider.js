import dayjs from "dayjs";
import { Text } from "native-base";
import { useState } from "react";
import { Agenda } from "react-native-calendars";

const CalendarWithSlider = ({ selectedDate }) => {
  const [items, setItems] = useState({});
  //   date format is YYYY-MM-DD
  const dateConverter = dayjs().format(selectedDate);

  /**
     * The data input should be like this
     * 
    "2023-09-21": [
      { name: "Clock-in", time: "08:30" },
      { name: "Clock-out", time: "17:30" },
    ],
    "2023-09-22": [
      { name: "Clock-in", time: "09:00" },
      { name: "Clock-out", time: "17:30" },
    ],
    */

  return (
    <Agenda
      selected={dateConverter}
      showClosingKnob={true}
      renderEmptyData={() => {
        return <Text>No Data</Text>;
      }}
    />
  );
};

export default CalendarWithSlider;
