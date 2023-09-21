import React, { useState, Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import { Text, Flex } from "native-base";
import dayjs from "dayjs";
import { useEffect } from "react";
import testIDs from "../testIDs";

const Schedule = ({ attendance }) => {
  const [items, setItems] = useState({});
  const selectedDate = dayjs().format("YYYY-MM-DD");
  /**
     * The data should be like this
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

  useEffect(() => {
    let dateList = {};

    attendance.map((item) => {
      dateList[item?.date] = [
        { name: "Clock-in", time: item?.time_in },
        { name: "Clock-out", time: item?.time_out },
      ];
    });

    setItems(dateList);
  }, [attendance]);

  return (
    <Agenda
      items={items}
      selected={selectedDate}
      showClosingKnob={true}
      renderItem={(item) => (
        <Flex>
          <Text>{item?.name}</Text>
          <Text>{!item?.time ? "No time" : item?.time}</Text>
        </Flex>
      )}
    />
  );
};

export default Schedule;
