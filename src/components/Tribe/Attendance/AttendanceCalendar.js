import { Fragment, memo } from "react";

import { Flex } from "native-base";

import AttendanceIcon from "./AttendanceIcon";
import AttendanceAttachment from "./AttendanceAttachment";

const AttendanceCalendar = ({
  renderCalendar,
  attachment,
  toggle,
  onSelectFile,
  onDelete,
  setAttachmentId,
  forceRenderer,
}) => {
  return (
    <Flex flex={1} gap={1}>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceIcon />
      <AttendanceAttachment
        attachment={attachment}
        toggle={toggle}
        onSelectFile={onSelectFile}
        onDelete={onDelete}
        setAttachmentId={setAttachmentId}
      />
    </Flex>
  );
};

export default memo(AttendanceCalendar);
