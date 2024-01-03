import { Fragment, memo } from "react";

import { View } from "react-native";

import AttendanceColor from "./AttendanceColor";
import AttendanceAttachment from "./AttendanceAttachment";

const AttendanceCalendar = ({ renderCalendar, attachment, setAttachmentId, reference }) => {
  return (
    <View style={{ flex: 1, gap: 1 }}>
      <Fragment>{renderCalendar()}</Fragment>
      <AttendanceColor />
      <AttendanceAttachment attachment={attachment} setAttachmentId={setAttachmentId} reference={reference} />
    </View>
  );
};

export default memo(AttendanceCalendar);
