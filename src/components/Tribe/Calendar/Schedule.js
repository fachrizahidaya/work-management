import React, { useState, Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import { Text, Flex } from "native-base";
import dayjs from "dayjs";
import { useEffect } from "react";
import testIDs from "./testIDs";

const Schedule = ({ attendance }) => {
  console.log("att", attendance);
  const [items, setItems] = useState({
    "2023-09-21": [
      { name: "Clock-in", time: "08:30" },
      { name: "Break", time: "09:30" },
      { name: "Clock-out", time: "17:30" },
    ],
    "2023-09-22": [
      { name: "Clock-in", time: "09:00" },
      { name: "Clock-out", time: "17:30" },
    ],
  });
  const selectedDate = dayjs().format("YYYY-MM-DD");

  // const loadItemsForMonth = (day) => {
  //   const newItems = { ...items };

  //   setTimeout(() => {
  //     for (let i = -15; i < 85; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = timeToString(time);

  //       if (!newItems[strTime]) {
  //         newItems[strTime] = [];

  //         const numItems = Math.floor(Math.random() * 3 + 1);
  //         for (let j = 0; j < numItems; j++) {
  //           newItems[strTime].push({
  //             name: "Item for " + strTime + " #" + j,
  //             height: Math.max(50, Math.floor(Math.random() * 150)),
  //             day: strTime,
  //           });
  //         }
  //       }
  //     }

  //     setItems(newItems);
  //   }, 1000);
  // };

  // useEffect(() => {
  //   loadItemsForMonth(selectedDate);
  // }, []);

  // const timeToString = (time) => {
  //   const date = dayjs(time);
  //   return date.toISOString().split("T")[0];
  // };

  // const renderDay = (day) => {
  //   if (day) {
  //     return <Text style={styles.customDay}>{day.getDay()}</Text>;
  //   }
  //   return <Flex style={styles.dayItem} />;
  // };

  // const renderItem = (reservation, isFirst) => {
  //   const fontSize = isFirst ? 16 : 14;
  //   const color = isFirst ? "black" : "#43515c";

  //   return (
  //     <TouchableOpacity
  //       testID={testIDs.agenda.ITEM}
  //       style={[styles.item, { height: reservation.height }]}
  //       onPress={() => Alert.alert(reservation.name)}
  //     >
  //       <Text style={{ fontSize, color }}>{reservation.name}</Text>
  //     </TouchableOpacity>
  //   );
  // };

  // const renderEmptyDate = () => {
  //   return (
  //     <Flex style={styles.emptyDate}>
  //       <Text>This is an empty date!</Text>
  //     </Flex>
  //   );
  // };

  // const rowHasChanged = (r1, r2) => {
  //   return r1.name !== r2.name;
  // };

  return (
    <Agenda
      items={items}
      selected={selectedDate}
      showClosingKnob={true}
      renderItem={(item) => (
        <Flex>
          <Text>{item?.name}</Text>
          <Text>{item?.time}</Text>
        </Flex>
      )}
    />
  );
};

export default Schedule;
