import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";

import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import { TextProps } from "../../shared/CustomStylings";
import SuccessModal from "../../shared/Modal/SuccessModal";
import LateOrEarly from "./FormType/LateOrEarly";
import LateAndEarly from "./FormType/LateAndEarly";
import LeaveOrPermit from "./FormType/LeaveOrPermit";
import SubmittedReport from "./FormType/SubmittedReport";
import AllGood from "./FormType/AllGood";

const AttendanceForm = ({
  toggleReport,
  date,
  onSubmit,
  hasClockInAndOut,
  hasLateWithoutReason,
  hasEarlyWithoutReason,
  hasLateAndEarlyWithoutReason,
  hasSubmittedLateNotEarly,
  hasSubmittedEarlyNotLate,
  hasSubmittedBothReports,
  hasSubmittedReportAlpa,
  hasSubmittedLateReport,
  hasSubmittedEarlyReport,
  notAttend,
  isLeave,
  CURRENT_DATE,
  reference,
  attendanceReportModalIsOpen,
  toggleAttendanceReportModal,
  requestType,
}) => {
  const [tabValue, setTabValue] = useState("late");
  /**
   * Handle for Late type
   */
  const lateType = date?.available_day_off
    ? [
        { label: "Late", value: "Late" },
        { label: "Permit", value: "Permit" },
        { label: "Other", value: "Other" },
        { label: "Day Off", value: "Day Off" },
      ]
    : [
        { label: "Late", value: "Late" },
        { label: "Permit", value: "Permit" },
        { label: "Other", value: "Other" },
      ];

  /**
   * Handle for Early type
   */
  const earlyType = [
    { label: "Went Home Early", value: "Went Home Early" },
    { label: "Permit", value: "Permit" },
    { label: "Other", value: "Other" },
  ];

  /**
   * Handle for Alpa type
   */
  const alpaType = [
    { label: "Alpa", value: "Alpa" },
    { label: "Sick", value: "Sick" },
    { label: "Permit", value: "Permit" },
    { label: "Other", value: "Other" },
  ];

  const tabs = useMemo(() => {
    return [
      { title: "late", value: "late" },
      { title: "early", value: "early" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  /**
   * Handle create attendance report
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      late_type: date?.lateType || "",
      late_reason: date?.lateReason || "",
      early_type: date?.earlyType || "",
      early_reason: date?.earlyReason || "",
      att_type: date?.attendanceType || "",
      att_reason: date?.attendanceReason || "",
    },
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      onSubmit(date?.id, values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    return () => {
      setTabValue("late");
    };
  }, [date]);

  return (
    <ActionSheet
      ref={reference}
      onClose={() =>
        !formik.isSubmitting && formik.status !== "processing" && toggleReport.current?.hide(formik.resetForm)
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          {/* If employee ontime for Clock in and Clock out */}
          {hasClockInAndOut && <AllGood date={date} />}

          {/* If employee Clock in late, require Late Report */}
          {hasLateWithoutReason && (
            <LateOrEarly
              formik={formik}
              arrayList={lateType}
              titleTime="Clock-in Time"
              time={date?.timeIn}
              title="Late Type"
              inputValue={formik.values.late_reason}
              inputOnChangeText={(value) => formik.setFieldValue("late_reason", value)}
              selectOnValueChange={(value) => formik.setFieldValue("late_type", value)}
              titleDuty="On Duty"
              timeDuty={date?.onDuty}
              titleLateOrEarly="Late"
              timeLateOrEarly={date?.late}
              placeholder="Select Late Type"
              fieldOption="late_type"
              inputType={formik.values.late_type}
            />
          )}

          {/* If employee Clock out early, require Early Report */}
          {hasEarlyWithoutReason && (
            <LateOrEarly
              formik={formik}
              arrayList={earlyType}
              titleTime="Clock-out Time"
              time={date?.timeOut}
              title="Early Type"
              inputValue={formik.values.early_reason}
              inputOnChangeText={(value) => formik.setFieldValue("early_reason", value)}
              selectOnValueChange={(value) => formik.setFieldValue("early_type", value)}
              titleDuty="Off Duty"
              timeDuty={date?.offDuty}
              titleLateOrEarly="Early"
              timeLateOrEarly={date?.early}
              placeholder="Select Early Type"
              fieldOption="early_type"
              inputType={formik.values.early_type}
            />
          )}

          {/* If report submitted for Late */}
          {hasSubmittedLateReport && (
            <SubmittedReport
              date={date}
              formik={formik}
              titleDuty="On Duty"
              titleClock="Clock-in Time"
              title="Late Type"
              field="late_type"
              types={lateType}
              fieldName="late_reason"
              reasonValue={formik.values.late_reason}
              typeValue={formik.values.late_type}
            />
          )}

          {/* If report submitted for Early */}
          {hasSubmittedEarlyReport && (
            <SubmittedReport
              date={date}
              formik={formik}
              titleDuty="Off Duty"
              titleClock="Clock-out Time"
              title="Early Type"
              field="early_type"
              types={earlyType}
              fieldName="early_reason"
              reasonValue={formik.values.early_reason}
              typeValue={formik.values.early_type}
            />
          )}

          {/* If report submitted for Alpa */}
          {hasSubmittedReportAlpa && (
            <SubmittedReport
              date={date}
              formik={formik}
              title="Unattendance Type"
              field="att_type"
              types={alpaType}
              fieldName="att_reason"
              alpa={true}
              reasonValue={formik.values.att_reason}
              typeValue={formik.values.att_type}
            />
          )}

          {/* If not yet submit report for Late and Early */}
          {hasLateAndEarlyWithoutReason && (
            <LateAndEarly
              tabs={tabs}
              tabValue={tabValue}
              onChangeTab={onChangeTab}
              onDuty={date?.onDuty}
              timeIn={date?.timeIn}
              late={date?.late}
              lateTypes={lateType}
              offDuty={date?.offDuty}
              early={date?.early}
              earlyTypes={earlyType}
              timeOut={date?.timeOut}
              formik={formik}
            />
          )}

          {hasSubmittedLateNotEarly && (
            <LateAndEarly
              tabs={tabs}
              tabValue={tabValue}
              onChangeTab={onChangeTab}
              onDuty={date?.onDuty}
              timeIn={date?.timeIn}
              late={date?.late}
              lateTypes={lateType}
              offDuty={date?.offDuty}
              early={date?.early}
              earlyTypes={earlyType}
              timeOut={date?.timeOut}
              formik={formik}
            />
          )}

          {hasSubmittedEarlyNotLate && (
            <LateAndEarly
              tabs={tabs}
              tabValue={tabValue}
              onChangeTab={onChangeTab}
              onDuty={date?.onDuty}
              timeIn={date?.timeIn}
              late={date?.late}
              lateTypes={lateType}
              offDuty={date?.offDuty}
              early={date?.early}
              earlyTypes={earlyType}
              timeOut={date?.timeOut}
              formik={formik}
            />
          )}

          {/* If report submitted Late and Early */}
          {hasSubmittedBothReports && (
            <LateAndEarly
              tabs={tabs}
              tabValue={tabValue}
              onChangeTab={onChangeTab}
              onDuty={date?.onDuty}
              timeIn={date?.timeIn}
              late={date?.late}
              lateTypes={lateType}
              offDuty={date?.offDuty}
              early={date?.early}
              earlyTypes={earlyType}
              timeOut={date?.timeOut}
              formik={formik}
            />
          )}

          {/* If Alpa */}
          {notAttend && (
            <SubmittedReport
              date={date}
              formik={formik}
              title="Unattendance Type"
              field="att_type"
              types={alpaType}
              fieldName="att_reason"
              placeholder="Select Alpa Type"
              alpa={true}
              reasonValue={formik.values.att_reason}
              typeValue={formik.values.att_type}
            />
          )}

          {/* If attendance type is Leave */}
          {isLeave && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

          {/* If did not clock-in */}
          {date?.attendanceType !== "Leave" &&
            date?.attendanceType !== "Permit" &&
            date?.dayType === "Work Day" &&
            !date?.timeIn &&
            date?.date === CURRENT_DATE && (
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    gap: 1,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      ...styles.content,
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderBottomColor: "#FFFFFF",
                    }}
                  >
                    <Text style={[{ fontSize: 16 }, TextProps]}>Clock-in required</Text>
                  </View>
                </View>
              </View>
            )}
        </View>
      </TouchableWithoutFeedback>
      <SuccessModal
        isOpen={attendanceReportModalIsOpen}
        toggle={toggleAttendanceReportModal}
        type={requestType}
        title="Report submitted!"
        description="Your report is logged"
      />
    </ActionSheet>
  );
};

export default memo(AttendanceForm);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
