import React from "react";

import { Text } from "react-native";

const NotificationTimeStamp = ({ timestamp }) => {
  return <Text style={{ color: "#8A9099", fontWeight: 400, marginBottom: 25, marginLeft: 44 }}>{timestamp}</Text>;
};

export default NotificationTimeStamp;
