import { Fragment, memo } from "react";

import { Flex } from "native-base";

import AttendanceIcon from "./AttendanceIcon";
import AttendanceAttachment from "./AttendanceAttachment";

const AttendanceCalendar = ({ renderCalendar, attachment, toggle, setAttachmentId }) => {
  return (
    <Flex flex={1} gap={1}>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceIcon />
      <AttendanceAttachment attachment={attachment} toggle={toggle} setAttachmentId={setAttachmentId} />
    </Flex>
  );
};

export default memo(AttendanceCalendar);
