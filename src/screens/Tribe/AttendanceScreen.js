import { useState, useCallback, useEffect, Fragment } from "react";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-toast-message";

import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { useDisclosure } from "../../hooks/useDisclosure";
import useCheckAccess from "../../hooks/useCheckAccess";
import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";
import AttendanceAction from "../../components/Tribe/Attendance/AttendanceAction";
import AddAttachment from "../../components/Tribe/Attendance/AddAttachment";
import ConfirmationModal from "../../components/shared/ConfirmationModal";

const AttendanceScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});
  const [fileAttachment, setFileAttachment] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);

  const updateAttendanceCheckAccess = useCheckAccess("update", "Attendance");

  const { isOpen: reportIsOpen, toggle: toggleReport } = useDisclosure(false);
  const { isOpen: addAttachmentIsOpen, toggle: toggleAddAttachment } = useDisclosure(false);
  const { isOpen: deleteAttachmentIsOpen, toggle: toggleDeleteAttachment } = useDisclosure(false);

  const attendanceFetchParameters = filter;

  const CURRENT_DATE = dayjs().format("YYYY-MM-DD");

  const {
    data: attachment,
    isFetching: attachmentIsFetching,
    isLoading: attachmentIsLoading,
    refetch: refetchAttachment,
  } = useFetch(`/hr/timesheets/personal/attachments`, [filter], attendanceFetchParameters);

  /**
   * Status attendance Handler
   */
  const allGood = { key: "allGood", color: "#EDEDED", name: "All Good", textColor: "#000000" };
  const reportRequired = { key: "reportRequired", color: "#FDC500", name: "Report Required", textColor: "#FFFFFF" };
  const submittedReport = { key: "submittedReport", color: "#186688", name: "Submitted Report", textColor: "#FFFFFF" };
  const dayOff = { key: "dayOff", color: "#3bc14a", name: "Day-off", textColor: "#FFFFFF" };
  const sick = { key: "sick", color: "red.600", name: "Sick", textColor: "#FFFFFF" };

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
  const hasSubmittedBothReports = date?.lateReason && date?.earlyReason;
  const hasSubmittedReportAlpa =
    date?.attendanceType === "Alpa" && date?.attendanceReason && date?.dayType === "Work Day";
  const notAttend =
    date?.attendanceType === "Alpa" &&
    date?.dayType === "Work Day" &&
    date?.date !== CURRENT_DATE &&
    !date?.attendanceReason;
  const isLeave = date?.attendanceType === "Work Day" && date?.attendanceType === "Leave";
  const isPermit = date?.attendanceType === "Work Day" && date?.attendanceType === "Permit";

  const {
    data: attendanceData,
    isFetching: attendanceDataIsFetching,
    refetch: refetchAttendanceData,
  } = useFetch(`/hr/timesheets/personal`, [filter], attendanceFetchParameters);

  /**
   * Switch month handler
   */
  const switchMonthHandler = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

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
   * Toggle date Handler
   * @param {*} day
   */
  const toggleDateHandler = useCallback((day) => {
    if (day) {
      const selectedDate = day.dateString;
      const dateData = items[selectedDate];
      if (dateData && dateData.length > 0) {
        dateData.map((item) => {
          if (item?.date && item?.confirmation === 0 && item?.dayType !== "Weekend") {
            toggleReport();
            setDate(item);
          }
        });
      }
    }
  });

  /**
   * Submit attendance report handler
   * @param {*} attendance_id
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const attendanceReportSubmitHandler = async (attendance_id, data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/timesheets/personal/${attendance_id}`, data);
      toggleReport();
      refetchAttendanceData();
      setSubmitting(false);
      setStatus("success");

      Toast.show({
        type: "success",
        text1: "Report submitted",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  /**
   * Month change handler
   * @param {*} newMonth
   */
  const handleMonthChange = useCallback((newMonth) => {
    switchMonthHandler(newMonth);
  }, []);

  /**
   * Select file handler
   */
  const selectFile = async () => {
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
          Alert.alert("Max file size is 3MB");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle attachment submit
   *
   * @param {*} data
   */
  const attachmentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/timesheets/personal/attachments`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      refetchAttachment();

      Toast.show({
        type: "success",
        text1: "Attachment submitted",
        position: "bottom",
      });
      setStatus("success");
      setSubmitting(false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
      setStatus("error");
      setSubmitting(false);
    }
  };

  const openDeleteAttachmentModalHandler = (id) => {
    setAttachmentId(id);
    toggleDeleteAttachment();
  };

  /**
   * Handle attachment delete event
   *
   * @param {*} attachment_id
   */
  const attachmentDeleteHandler = async (attachment_id, itemName, setIsLoading) => {
    try {
      const res = await axiosInstance.delete(`/hr/timesheets/personal/attachments/${attachment_id}`);
      refetchAttachment();

      Toast.show({
        type: "success",
        text1: "Attachment deleted",
        position: "bottom",
      });
      setIsLoading(false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
      setIsLoading(false);
    }
  };

  /**
   * Marked dates in Calendar Handler
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
            (event?.dayType === "Work Day" && event?.attendanceType === "Permit")
          ) {
            backgroundColor = dayOff.color;
            textColor = dayOff.textColor;
          } else if (
            (event?.dayType === "Work Day" && event?.early && !event?.earlyReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" && event?.late && !event?.lateReason && !event?.confirmation) ||
            (event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              event?.date !== CURRENT_DATE &&
              !event?.attendanceReason)
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
            (event?.dayType === "Work Day" && event?.attendanceType !== "Alpa" && event?.attendanceReason) ||
            (event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              event?.attendanceReason &&
              event?.confirmation === 0 &&
              event?.date !== CURRENT_DATE)
          ) {
            backgroundColor = submittedReport.color;
            textColor = submittedReport.textColor;
          } else if (
            (event?.dayType === "Work Day" && event?.attendanceType === "Sick") ||
            event?.attendanceType === "Leave"
          ) {
            backgroundColor = sick.color;
            textColor = sick.textColor;
          } else if (
            (event?.confirmation && event?.dayType === "Work Day") ||
            (!event?.confirmation &&
              event?.dayType === "Work Day" &&
              event?.attendanceType === "Alpa" &&
              !event?.timeIn)
          ) {
            backgroundColor = allGood.color;
            textColor = allGood.textColor;
          }
          customStyles = {
            container: {
              backgroundColor: backgroundColor,
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
          current={CURRENT_DATE}
          markingType={"custom"}
          markedDates={markedDates}
          onMonthChange={(date) => handleMonthChange(date)}
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
          <AttendanceCalendar
            attendance={attendanceData?.data}
            onMonthChange={switchMonthHandler}
            onSubmit={attendanceReportSubmitHandler}
            reportIsOpen={reportIsOpen}
            toggleReport={toggleReport}
            updateAttendanceCheckAccess={updateAttendanceCheckAccess}
            onSelectDate={toggleDateHandler}
            items={items}
            renderCalendar={renderCalendarWithMultiDotMarking}
            attachment={attachment}
            toggle={toggleAddAttachment}
            onSelectFile={selectFile}
            onDelete={attachmentDeleteHandler}
            setAttachmentId={openDeleteAttachmentModalHandler}
          />
        </ScrollView>
        <Toast />
      </SafeAreaView>
      <AttendanceAction
        reportIsOpen={reportIsOpen}
        toggleReport={toggleReport}
        date={date}
        onSubmit={attendanceReportSubmitHandler}
        hasClockInAndOut={hasClockInAndOut}
        hasLateWithoutReason={hasLateWithoutReason}
        hasEarlyWithoutReason={hasEarlyWithoutReason}
        hasLateAndEarlyWithoutReason={hasLateAndEarlyWithoutReason}
        hasSubmittedBothReports={hasSubmittedBothReports}
        hasSubmittedReportAlpa={hasSubmittedReportAlpa}
        hasSubmittedLateReport={hasSubmittedLateReport}
        hasSubmittedEarlyReport={hasSubmittedEarlyReport}
        notAttend={notAttend}
        isLeave={isLeave}
        isPermit={isPermit}
        CURRENT_DATE={CURRENT_DATE}
      />

      <AddAttachment
        isOpen={addAttachmentIsOpen}
        toggle={toggleAddAttachment}
        onSelectFile={selectFile}
        fileAttachment={fileAttachment}
        setFileAttachment={setFileAttachment}
        onSubmit={attachmentSubmitHandler}
      />

      <ConfirmationModal
        isOpen={deleteAttachmentIsOpen}
        toggle={toggleDeleteAttachment}
        successMessage="Attachment Deleted"
        isDelete={true}
        description="Are you sure want to delete attachment?"
        apiUrl={`/hr/timesheets/personal/attachments/${attachmentId}`}
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
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
