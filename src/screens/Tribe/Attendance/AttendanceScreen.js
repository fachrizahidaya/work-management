import { useState, useCallback, useEffect, Fragment, useRef } from "react";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { ErrorToastProps } from "../../../components/shared/CustomStylings";
import axiosInstance from "../../../config/api";
import PageHeader from "../../../components/shared/PageHeader";
import useCheckAccess from "../../../hooks/useCheckAccess";
import AttendanceCalendar from "../../../components/Tribe/Attendance/AttendanceCalendar";
import AttendanceForm from "../../../components/Tribe/Attendance/AttendanceForm";
import AddAttendanceAttachment from "../../../components/Tribe/Attendance/AddAttendanceAttachment";
import AttendanceAttachment from "../../../components/Tribe/Attendance/AttendanceAttachment";
import AttendanceColor from "../../../components/Tribe/Attendance/AttendanceColor";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";
import RemoveConfirmationModal from "../../../components/shared/RemoveConfirmationModal";
import { useLoading } from "../../../hooks/useLoading";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});
  const [fileAttachment, setFileAttachment] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);
  const [requestType, setRequestType] = useState("");

  const currentDate = dayjs().format("YYYY-MM-DD");

  const attendanceScreenSheetRef = useRef(null);
  const attachmentScreenSheetRef = useRef(null);

  const updateAttendanceCheckAccess = useCheckAccess("update", "Attendance");

  const { isOpen: deleteAttachmentIsOpen, toggle: toggleDeleteAttachment } = useDisclosure(false);
  const { isOpen: attendanceReportModalIsOpen, toggle: toggleAttendanceReportModal } = useDisclosure(false);
  const { isOpen: attendanceAttachmentModalIsOpen, toggle: toggleAttendanceAttachmentModal } = useDisclosure(false);
  const { isOpen: successDeleteModalIsOpen, toggle: toggleSuccessDeleteModal } = useDisclosure(false);

  const { toggle: toggleDeleteAttendanceAttachment, isLoading: deleteAttendanceAttachmentIsLoading } =
    useLoading(false);

  const attendanceFetchParameters = filter;

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  const {
    data: attachment,
    isFetching: attachmentIsFetching,
    refetch: refetchAttachment,
  } = useFetch(`/hr/timesheets/personal/attachments`, [filter], attendanceFetchParameters);

  /**
   * Handle attendance status by day
   */
  const statusTypes = [
    { key: "allGood", color: "#EDEDED", name: "All Good", textColor: "#000000" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required", textColor: "#FFFFFF" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report", textColor: "#FFFFFF" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off", textColor: "#FFFFFF" },
    { key: "sick", color: "#d6293a", name: "Sick", textColor: "#FFFFFF" },
  ];
  const [allGood, reportRequired, submittedReport, dayOff, sick] = statusTypes;

  /**
   * Handle attendance for form report by day
   */
  const isWorkDay = date?.dayType === "Work Day";
  const attendanceType = date?.attendanceType;
  const hasClockInAndOut =
    isWorkDay && !date?.lateType && !date?.earlyType && date?.timeIn && !["Leave", "Alpa"].includes(attendanceType);
  const hasLateWithoutReason = date?.lateType && !date?.lateReason && !date?.earlyType;
  const hasEarlyWithoutReason = date?.earlyType && !date?.earlyReason && !date?.lateType;
  const hasLateAndEarlyWithoutReason = date?.lateType && date?.earlyType && !date?.lateReason && !date?.earlyReason;
  const hasSubmittedLateReport = date?.lateType && date?.lateReason && !date?.earlyType;
  const hasSubmittedEarlyReport = date?.earlyType && date?.earlyReason && !date?.lateType;
  const hasSubmittedLateNotEarly =
    date?.lateType && date?.lateReason && date?.earlyType && !date?.earlyReason && !date?.earlyStatus;
  const hasSubmittedEarlyNotLate =
    date?.earlyType && date?.earlyReason && date?.lateType && !date?.lateReason && !date?.lateStatus;
  const hasSubmittedBothReports = date?.lateReason && date?.earlyReason;
  const hasSubmittedReportAlpa =
    ["Alpa", "Sick", "Other"].includes(attendanceType) && date?.attendanceReason && isWorkDay;
  const notAttend = attendanceType === "Alpa" && isWorkDay && date?.date !== currentDate && !date?.attendanceReason;
  const isLeave = attendanceType === "Leave" || attendanceType === "Permit";

  /**
   *  Handle switch month on calendar
   */
  const switchMonthHandler = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

  /**
   * Handle to create appropriate object for react-native-calendar
   */
  useEffect(() => {
    if (attendanceData?.data && attendanceData?.data.length > 0) {
      let dateList = {};

      attendanceData?.data.forEach((item) => {
        dateList[item?.date] = [
          {
            id: item?.id,
            attendanceReason: item?.att_reason,
            attendanceType: item?.att_type,
            timeIn: item?.time_in,
            late: item?.late,
            lateReason: item?.late_reason,
            lateType: item?.late_type,
            lateStatus: item?.late_status,
            dayType: item?.day_type,
            timeOut: item?.time_out,
            early: item?.early,
            earlyReason: item?.early_reason,
            earlyType: item?.early_type,
            earlyStatus: item?.early_status,
            confirmation: item?.confirm,
            date: item?.date,
            onDuty: item?.on_duty,
            offDuty: item?.off_duty,
          },
        ];
      });

      setItems(dateList);
    }
  }, [attendanceData?.data]);

  /**
   * Handle toggle date
   * @param {*} day
   */
  const toggleDateHandler = useCallback((day) => {
    if (day) {
      const selectedDate = day.dateString;
      const dateData = items[selectedDate];
      if (dateData && dateData.length > 0) {
        dateData.map((item) => {
          if (item?.date && item?.confirmation === 0 && item?.dayType === "Work Day") {
            setDate(item);
            attendanceScreenSheetRef.current?.show();
          }
        });
      }
    }
  });

  /**
   * Handle selected attendance attachment to delete
   * @param {*} id
   */
  const openDeleteAttachmentModalHandler = (id) => {
    setAttachmentId(id);
    toggleDeleteAttachment();
  };

  /**
   * Handle select file for attendance attachment
   */
  const selectFileHandler = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });
        } else {
          Toast.show("Max file size is 3MB", ErrorToastProps);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle submit attendance report
   * @param {*} attendance_id
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const attendanceReportSubmitHandler = async (attendance_id, data, setSubmitting, setStatus) => {
    try {
      await axiosInstance.patch(`/hr/timesheets/personal/${attendance_id}`, data);
      refetchAttendanceData();
      setSubmitting(false);
      setStatus("success");
      toggleAttendanceReportModal();
      setRequestType("info");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle submit attendance attachment
   *
   * @param {*} data
   */
  const attachmentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post(`/hr/timesheets/personal/attachments`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      refetchAttachment();
      toggleAttendanceAttachmentModal();
      setRequestType("info");
      setStatus("success");
      setSubmitting(false);
    } catch (err) {
      Toast.show(err.response.data.message, ErrorToastProps);
      setStatus("error");
      setSubmitting(false);
    }
  };

  const deleteAttendanceAttachmentHandler = async () => {
    try {
      toggleDeleteAttendanceAttachment();
      const res = await axiosInstance.delete(`/hr/timesheets/personal/attachments/${attachmentId}`);
      toggleDeleteAttendanceAttachment();
      setRequestType("danger");
      toggleDeleteAttachment();
      refetchAttachment();
    } catch (err) {
      console.log(err);
      toggleDeleteAttendanceAttachment();
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle marked dates on AttendanceCalendar
   * @returns
   */
  const renderCalendarWithMultiDotMarking = () => {
    const markedDates = {};

    for (const date in items) {
      if (items.hasOwnProperty(date)) {
        const events = items[date];
        const customStyles = {};

        events.forEach((event) => {
          let backgroundColor = "";
          let textColor = "";
          const {
            attendanceType,
            dayType,
            early,
            late,
            confirmation,
            earlyReason,
            lateReason,
            earlyType,
            lateType,
            earlyStatus,
            lateStatus,
            attendanceReason,
            timeIn,
            timeOut,
          } = event;

          if (attendanceType === "Leave" || dayType === "Weekend" || dayType === "Holiday" || dayType === "Day Off") {
            backgroundColor = dayOff.color;
            textColor = dayOff.textColor;
          } else if (
            (early && !earlyReason && !confirmation) ||
            (late && !lateReason && !confirmation) ||
            (attendanceType === "Alpa" && !attendanceReason && date !== currentDate)
          ) {
            backgroundColor = reportRequired.color;
            textColor = reportRequired.textColor;
          } else if (
            (((early && earlyReason) || (late && lateReason)) && !confirmation) ||
            (late && lateReason && earlyType && !earlyReason && !earlyStatus) ||
            (early && earlyReason && lateType && !lateReason && !lateStatus) ||
            (attendanceType === "Permit" && attendanceReason) ||
            (attendanceType === "Alpa" && attendanceReason) ||
            (attendanceType === "Other" && attendanceReason && !confirmation && date !== currentDate)
          ) {
            backgroundColor = submittedReport.color;
            textColor = submittedReport.textColor;
          } else if (attendanceType === "Sick" && attendanceReason) {
            backgroundColor = sick.color;
            textColor = sick.textColor;
          } else if (
            confirmation ||
            dayType === "Work Day" ||
            (!confirmation && dayType === "Work Day" && attendanceType === "Alpa" && !timeIn) ||
            (!confirmation && dayType === "Work Day" && attendanceType === "Attend" && timeIn && timeOut) ||
            (!confirmation && dayType === "Work Day" && attendanceType === "Attend" && timeIn && !timeOut) ||
            (!confirmation && dayType === "Work Day" && attendanceType === "Alpa" && !timeIn && !timeOut)
          ) {
            backgroundColor = allGood.color;
            textColor = allGood.textColor;
          }

          customStyles.container = {
            backgroundColor: backgroundColor,
            borderRadius: 5,
          };
          customStyles.text = {
            color: textColor,
          };
        });

        markedDates[date] = { customStyles };
      }
    }

    return (
      <Fragment>
        <Calendar
          onDayPress={updateAttendanceCheckAccess && toggleDateHandler}
          style={styles.calendar}
          current={currentDate}
          markingType="custom"
          markedDates={markedDates}
          onMonthChange={switchMonthHandler}
          theme={{
            arrowColor: "black",
            "stylesheet.calendar.header": {
              dayTextAtIndex0: { color: "#FF7272" },
              dayTextAtIndex6: { color: "#FF7272" },
            },
          }}
        />
      </Fragment>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PageHeader width={200} title="My Attendance" backButton={false} />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={attendanceDataIsFetching && attachmentIsFetching}
              onRefresh={() => {
                refetchAttendanceData();
                refetchAttachment();
              }}
            />
          }
        >
          <AttendanceCalendar renderCalendar={renderCalendarWithMultiDotMarking} />
          <AttendanceColor />
          <AttendanceAttachment
            attachment={attachment}
            reference={attachmentScreenSheetRef}
            setAttachmentId={openDeleteAttachmentModalHandler}
            attachmentIsFetching={attachmentIsFetching}
            refetchAttachment={refetchAttachment}
          />
        </ScrollView>
      </SafeAreaView>
      <AttendanceForm
        toggleReport={attendanceScreenSheetRef}
        date={date}
        onSubmit={attendanceReportSubmitHandler}
        hasClockInAndOut={hasClockInAndOut}
        hasLateWithoutReason={hasLateWithoutReason}
        hasEarlyWithoutReason={hasEarlyWithoutReason}
        hasLateAndEarlyWithoutReason={hasLateAndEarlyWithoutReason}
        hasSubmittedLateNotEarly={hasSubmittedLateNotEarly}
        hasSubmittedEarlyNotLate={hasSubmittedEarlyNotLate}
        hasSubmittedBothReports={hasSubmittedBothReports}
        hasSubmittedReportAlpa={hasSubmittedReportAlpa}
        hasSubmittedLateReport={hasSubmittedLateReport}
        hasSubmittedEarlyReport={hasSubmittedEarlyReport}
        notAttend={notAttend}
        isLeave={isLeave}
        CURRENT_DATE={currentDate}
        reference={attendanceScreenSheetRef}
        attendanceReportModalIsOpen={attendanceReportModalIsOpen}
        toggleAttendanceReportModal={toggleAttendanceReportModal}
        requestType={requestType}
      />

      <AddAttendanceAttachment
        onSelectFile={selectFileHandler}
        fileAttachment={fileAttachment}
        setFileAttachment={setFileAttachment}
        onSubmit={attachmentSubmitHandler}
        reference={attachmentScreenSheetRef}
        attendanceAttachmentModalIsOpen={attendanceAttachmentModalIsOpen}
        toggleAttendanceAttachmentModal={toggleAttendanceAttachmentModal}
        requestType={requestType}
      />

      <RemoveConfirmationModal
        isOpen={deleteAttachmentIsOpen}
        toggle={toggleDeleteAttachment}
        description="Are you sure want to delete attachment?"
        onPress={() => deleteAttendanceAttachmentHandler()}
        isLoading={deleteAttendanceAttachmentIsLoading}
      />

      <SuccessModal
        isOpen={successDeleteModalIsOpen}
        toggle={toggleSuccessDeleteModal}
        type={requestType}
        title="Changes saved!"
        description="Data has successfully deleted"
      />
    </>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
  calendar: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
