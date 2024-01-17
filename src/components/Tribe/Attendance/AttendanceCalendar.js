import { Fragment, memo } from "react";

import { View } from "react-native";

const AttendanceCalendar = ({ renderCalendar }) => {
  return (
    <View style={{ flex: 1, gap: 1 }}>
      <Fragment>{renderCalendar()}</Fragment>
    </View>
  );
};

export default memo(AttendanceCalendar);
