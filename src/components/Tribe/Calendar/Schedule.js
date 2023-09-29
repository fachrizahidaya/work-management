import React, { useState, Component, useEffect } from "react";

import { Agenda } from "react-native-calendars";
import dayjs from "dayjs";

import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, Flex } from "native-base";

import testIDs from "../testIDs";

const Schedule = ({}) => {
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

  return <Agenda selected={selectedDate} showClosingKnob={true} />;
};

export default Schedule;
