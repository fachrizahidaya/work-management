import { Fragment, memo } from "react";

import AttendanceIcon from "./AttendanceIcon";
import { Flex } from "native-base";

const AttendanceCalendar = ({ renderCalendar }) => {
  return (
    <Flex flex={1}>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceIcon />
    </Flex>
  );
};

export default memo(AttendanceCalendar);
