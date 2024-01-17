import { useEffect, useState } from "react";

import dayjs from "dayjs";
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

import { Text } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const ChatTimeStamp = ({ time, timestamp, useDay }) => {
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const currentDay = dayjs();
  const startOfWeek = currentDay.clone().subtract(7, "d");

  useEffect(() => {
    setCurrentTimestamp(dayjs(dayjs(timestamp).format("YYYY-MM-DD")));
  }, [timestamp]);

  const formatTimestamp = () => {
    if (
      currentTimestamp.isBetween(startOfWeek.format("YYYY-MM-DD"), currentDay.format("YYYY-MM-DD"), undefined, "[]")
    ) {
      if (currentTimestamp.isSame(currentDay.format("YYYY-MM-DD"))) {
        return useDay ? "Today" : time;
      } else {
        if (currentTimestamp.diff(currentDay, "days") === -1) {
          return "Yesterday";
        } else {
          return currentTimestamp.format("dddd");
        }
      }
    } else {
      return currentTimestamp.format("DD/MM/YYYY");
    }
  };

  return currentTimestamp && <Text style={[{ fontSize: 12 }, TextProps]}>{formatTimestamp()}</Text>;
};

export default ChatTimeStamp;
