import { Fragment, memo } from "react";

import { View } from "react-native";

import AttendanceIcon from "./AttendanceIcon";
import AttendanceAttachment from "./AttendanceAttachment";

const AttendanceCalendar = ({ renderCalendar, attachment, toggle, setAttachmentId }) => {
  return (
    <View style={{ flex: 1, gap: 1 }}>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceIcon />
      <AttendanceAttachment attachment={attachment} toggle={toggle} setAttachmentId={setAttachmentId} />
    </View>
  );
};

export default memo(AttendanceCalendar);
