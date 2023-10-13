import React from "react";

import { Text } from "native-base";

const NotificationTimeStamp = ({ timestamp }) => {
  return (
    <Text color="#8A9099" style={{ marginBottom: 25, marginLeft: 44 }} fontWeight={400}>
      {timestamp}
    </Text>
  );
};

export default NotificationTimeStamp;
