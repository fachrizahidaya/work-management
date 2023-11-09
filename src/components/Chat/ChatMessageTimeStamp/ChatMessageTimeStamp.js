import { useEffect, useState } from "react";

import { Badge } from "native-base";
import dayjs from "dayjs";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const ChatMessageTimeStamp = ({ timestamp }) => {
  const [currentTimeStamp, setCurrentTimeStamp] = useState(null);
  const currentDay = dayjs();
  const startOfWeek = currentDay.clone().subtract(7, "d");

  const formatTimeStamp = () => {
    if (currentTimeStamp.isBetween(startOfWeek, currentDay.format("YYYY-MM-DD"), undefined, "[]")) {
      if (currentTimeStamp.isSame(currentDay.format("YYYY-MM-DD"))) {
        return "Today";
      } else {
        if (currentTimeStamp.diff(currentDay, "days") === -1) {
          return "Yesterday";
        } else {
          return currentTimeStamp.format("dddd");
        }
      }
    } else {
      return currentTimeStamp.format("DD/MM/YYYY");
    }
  };

  useEffect(() => {
    setCurrentTimeStamp(dayjs(dayjs(timestamp).format("YYYY-MM-DD")));
  }, [timestamp]);

  return <>{currentTimeStamp && <Badge alignSelf="center">{formatTimeStamp()}</Badge>}</>;
};

export default ChatMessageTimeStamp;
