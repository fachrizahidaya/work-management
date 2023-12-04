import { Fragment, memo } from "react";

import AttendanceIcon from "./AttendanceIcon";

const AttendanceCalendar = ({ renderCalendar }) => {
  return (
    <>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceIcon />
    </>
  );
};

export default memo(AttendanceCalendar);
