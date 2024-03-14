import { useState, useCallback, useEffect, Fragment, useRef } from "react";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import axiosInstance from "../../../config/api";
import PageHeader from "../../../components/shared/PageHeader";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import useCheckAccess from "../../../hooks/useCheckAccess";
import AttendanceCalendar from "../../../components/Tribe/Attendance/AttendanceCalendar";
import AttendanceForm from "../../../components/Tribe/Attendance/AttendanceForm";
import AddAttendanceAttachment from "../../../components/Tribe/Attendance/AddAttendanceAttachment";
import AttendanceAttachment from "../../../components/Tribe/Attendance/AttendanceAttachment";
import AttendanceColor from "../../../components/Tribe/Attendance/AttendanceColor";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});
  const [fileAttachment, setFileAttachment] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);
  const [deleteAttendanceAttachment, setDeleteAttendanceAttachment] = useState(false);
  const [requestType, setRequestType] = useState("");

  const currentDate = dayjs().format("YYYY-MM-DD");

  const attendanceScreenSheetRef = useRef(null);
  const attachmentScreenSheetRef = useRef(null);

  const updateAttendanceCheckAccess = useCheckAccess("update", "Attendance");

  const { isOpen: deleteAttachmentIsOpen, toggle: toggleDeleteAttachment } = useDisclosure(false);
  const { isOpen: attendanceReportModalIsOpen, toggle: toggleAttendanceReportModal } = useDisclosure(false);
  const { isOpen: attendanceAttachmentModalIsOpen, toggle: toggleAttendanceAttachmentModal } = useDisclosure(false);
  const { isOpen: successDeleteModalIsOpen, toggle: toggleSuccessDeleteModal } = useDisclosure(false);

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
  const allGood = {
    key: "allGood",
    color: "#EDEDED",
    name: "All Good",
    textColor: "#000000",
  };
  const reportRequired = {
    key: "reportRequired",
    color: "#FDC500",
    name: "Report Required",
    textColor: "#FFFFFF",
  };
  const submittedReport = {
    key: "submittedReport",
    color: "#186688",
    name: "Submitted Report",
    textColor: "#FFFFFF",
  };
  const dayOff = {
    key: "dayOff",
    color: "#3bc14a",
    name: "Day-off",
    textColor: "#FFFFFF",
  };
  const sick = {
    key: "sick",
    color: "#d6293a",
    name: "Sick",
    textColor: "#FFFFFF",
  };

  /**
   * Handle attendance for form report by day
   */
  const isWorkDay = date?.dayType === "Work Day";
  const hasClockInAndOut =
    isWorkDay &&
    !date?.lateType &&
    !date?.earlyType &&
    date?.timeIn &&
    (date?.attendanceType !== "Permit" || date?.attendanceType !== "Leave" || date?.attendanceType !== "Alpa");
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
    (date?.attendanceType === "Alpa" ||
      date?.attendanceType === "Permit" ||
      date?.attendanceType === "Sick" ||
      date?.attendanceType === "Other") &&
    date?.attendanceReason &&
    date?.dayType === "Work Day";
  const notAttend =
    date?.attendanceType === "Alpa" &&
    date?.dayType === "Work Day" &&
    date?.date !== currentDate &&
    !date?.attendanceReason;
  const isLeave = date?.attendanceType === "Work Day" && date?.attendanceType === "Leave";

  /**
   *  Handle switch month on calendar
   */
  const switchMonthHandler = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

  /**
   * Handle switch month on calendar
   * @param {*} newMonth
   */
  const monthChangeHandler = useCallback((newMonth) => {
    switchMonthHandler(newMonth);
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
      // Toast.show("Report submitted", SuccessToastProps);
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
      // Toast.show("Attachment submitted", SuccessToastProps);
      setStatus("success");
      setSubmitting(false);
    } catch (err) {
      Toast.show(err.response.data.message, ErrorToastProps);
      setStatus("error");
      setSubmitting(false);
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
        var customStyles = {};
        events.forEach((event) => {
          let backgroundColor = "";
          let textColor = "";

          if (
            (event?.dayType === "Work Day" && event?.attendanceType === "Leave") ||
            event?.dayType === "Weekend" ||
            event?.dayType === "Holiday"
          ) {
            backgroundColor = dayOff.color;
            textColor = dayOff.textColor;
          } else if (
            (event?.dayType === "Work Day" && event?.early && !event?.earlyReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.late && !event?.lateReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              !event?.attendanceReason &&
              event?.date !== currentDate)
          ) {
            backgroundColor = reportRequired.color;
            textColor = reportRequired.textColor;
          } else if (
            (event?.dayType === "Work Day" &&
              event?.early &&
              event?.earlyReason &&
              event?.attendanceType === "Attend" &&
              !event?.confirmation) ||
            (event?.dayType === "Work Day" &&
              event?.late &&
              event?.lateReason &&
              event?.attendanceType === "Attend" &&
              !event?.confirmation) ||
            (event?.late && event?.lateReason && event?.earlyType && !event?.earlyReason && !event?.earlyStatus) ||
            (event?.early && event?.earlyReason && event?.lateType && !event?.lateReason && !event?.lateStatus) ||
            (event?.dayType === "Work Day" && event?.attendanceType === "Permit" && event?.attendanceReason) ||
            (event?.dayType === "Work Day" && event?.attendanceType === "Alpa" && event?.attendanceReason) ||
            (event?.attendanceType === "Other" &&
              event?.attendanceReason &&
              !event?.confirmation &&
              event?.date !== currentDate)
          ) {
            backgroundColor = submittedReport.color;
            textColor = submittedReport.textColor;
          } else if (event?.dayType === "Work Day" && event?.attendanceType === "Sick" && event?.attendanceReason) {
            backgroundColor = sick.color;
            textColor = sick.textColor;
          } else if (
            (event?.confirmation && event?.dayType === "Work Day") ||
            (!event?.confirmation &&
              event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              !event?.timeIn) ||
            (!event?.confirmation &&
              event?.dayType === "Work Day" &&
              event?.attendanceType === "Attend" &&
              event?.timeIn &&
              event?.timeOut) ||
            (!event?.confirmation &&
              event?.dayType === "Work Day" &&
              event?.attendanceType === "Attend" &&
              event?.timeIn &&
              !event?.timeOut) ||
            (!event?.confirmation &&
              event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              !event?.timeIn &&
              !event?.timeOut)
          ) {
            backgroundColor = allGood.color;
            textColor = allGood.textColor;
          }
          customStyles = {
            container: {
              backgroundColor: backgroundColor,
              borderRadius: 5,
            },
            text: {
              color: textColor,
            },
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
          markingType={"custom"}
          markedDates={markedDates}
          onMonthChange={(date) => monthChangeHandler(date)}
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
                refetchAttendanceData;
                refetchAttachment;
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

      <ConfirmationModal
        isOpen={deleteAttachmentIsOpen}
        toggle={toggleDeleteAttachment}
        successMessage="Attachment Deleted"
        isDelete={true}
        description="Are you sure want to delete attachment?"
        apiUrl={`/hr/timesheets/personal/attachments/${attachmentId}`}
        hasSuccessFunc={true}
        onSuccess={() => {
          setDeleteAttendanceAttachment(true);
          setRequestType("danger");
          refetchAttachment();
        }}
        otherModal={true}
        toggleOtherModal={toggleSuccessDeleteModal}
        successStatus={deleteAttendanceAttachment}
        showSuccessToast={false}
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
