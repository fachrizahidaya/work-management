import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";

import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import FormButton from "../../shared/FormButton";
import Tabs from "../../shared/Tabs";
import Input from "../../shared/Forms/Input";
import Select from "../../shared/Forms/Select";
import { TextProps } from "../../shared/CustomStylings";

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
}) => {
  const [tabValue, setTabValue] = useState("late");
  /**
   * Late type Handler
   */
  const lateType = [
    { label: "Late", value: "Late" },
    { label: "Permit", value: "Permit" },
    { label: "Other", value: "Other" },
  ];

  /**
   * Early type Handler
   */
  const earlyType = [
    { label: "Went Home Early", value: "Went Home Early" },
    { label: "Permit", value: "Permit" },
    { label: "Other", value: "Other" },
  ];

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
   * Create attendance report handler
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
          {/* {hasClockInAndOut && (
            <View style={{ width: "100%", gap: 10 }}>
              <View style={styles.clock}>
                <View>
                  <Text style={[{ fontSize: 12 }, TextProps]}>Clock-in Time</Text>
                  <Text style={[{ fontSize: 12 }, TextProps]}>{date?.timeIn}</Text>
                </View>
                {!date?.timeOut ? null : (
                  <View>
                    <Text style={[{ fontSize: 12 }, TextProps]}>Clock-out Time</Text>
                    <Text style={[{ fontSize: 12 }, TextProps]}>{date?.timeOut}</Text>
                  </View>
                )}
              </View>
            </View>
          )} */}

          {/* If employee Clock in late, require Late Report */}
          {hasLateWithoutReason && (
            <LateOrEarlyTime
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
            />
          )}

          {/* If employee Clock out early, require Early Report */}
          {hasEarlyWithoutReason && (
            <LateOrEarlyTime
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
            />
          )}

          {/* If report submitted for Late */}
          {hasSubmittedLateReport && (
            <View style={{ width: "100%", gap: 10 }}>
              <Clock
                titleDuty="On Duty"
                timeDuty={date?.onDuty}
                titleClock="Clock-in Time"
                timeInOrTimeOut={date?.timeIn}
                lateOrEarly={date?.late}
              />
              <Options
                formik={formik}
                value={formik.values.late_type}
                title="Late Type"
                field="late_type"
                types={lateType}
                valueChange={(value) => formik.setFieldValue("late_type", value)}
              />
              <Reason formik={formik} value={formik.values.late_reason} fieldName="late_reason" />
              <FormButton
                width="full"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                <Text style={{ color: "#FFFFFF" }}>Save</Text>
              </FormButton>
            </View>
          )}

          {/* If report submitted for Early */}
          {hasSubmittedEarlyReport && (
            <View style={{ width: "100%", gap: 10 }}>
              <Clock
                titleDuty="Off Duty"
                timeDuty={date?.offDuty}
                titleClock="Clock-out Time"
                timeInOrTimeOut={date?.timeOut}
                lateOrEarly={date?.early}
              />
              <Options
                formik={formik}
                value={formik.values.early_type}
                title="Early Type"
                field="early_type"
                types={earlyType}
                valueChange={(value) => formik.setFieldValue("early_type", value)}
              />
              <Reason formik={formik} value={formik.values.early_reason} fieldName="early_reason" />
              <FormButton
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                <Text style={{ color: "#FFFFFF" }}>Save</Text>
              </FormButton>
            </View>
          )}

          {/* If report submitted for Alpa */}
          {hasSubmittedReportAlpa && (
            <View style={{ width: "100%", gap: 10 }}>
              <Options
                formik={formik}
                title="Unattendance Type"
                field="att_type"
                types={alpaType}
                value={formik.values.att_type}
                valueChange={(value) => formik.setFieldValue("att_type", value)}
              />
              <Reason formik={formik} value={formik.values.att_reason} fieldName="att_reason" />
              <FormButton
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                <Text style={{ color: "#FFFFFF" }}>Save</Text>
              </FormButton>
            </View>
          )}

          {/* If not yet submit report for Late and Early */}
          {hasLateAndEarlyWithoutReason && (
            <LateAndEarlyTime
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
            <LateAndEarlyTime
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
            <LateAndEarlyTime
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
            <LateAndEarlyTime
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
            <View style={{ width: "100%", gap: 10 }}>
              <Options
                placeholder="Select Alpa Type"
                formik={formik}
                title="Unattendance Type"
                field="att_type"
                types={alpaType}
                valueChange={(value) => formik.setFieldValue("att_type", value)}
                value={formik.values.att_type}
              />
              <Reason formik={formik} value={formik.values.att_reason} fieldName="att_reason" />
              <FormButton
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                <Text style={{ color: "#FFFFFF" }}>Save</Text>
              </FormButton>
            </View>
          )}

          {/* If attendance type is Leave */}
          {isLeave && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

          {/* If did not clock-in */}
          {date?.dayType === "Work Day" && !date?.timeIn && date?.date === CURRENT_DATE && (
            <View style={{ width: "100%", gap: 10 }}>
              <View>
                <Text style={[TextProps]}>Clock-in required</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};

export default AttendanceForm;

const styles = StyleSheet.create({
  clock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});

const Clock = ({ titleDuty, timeDuty, titleClock, timeInOrTimeOut, lateOrEarly }) => {
  return (
    <View style={styles.clock}>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>{titleDuty}</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{timeDuty}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <View>
          <Text style={[{ fontSize: 12 }, TextProps]}>{titleClock}</Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>
            {timeInOrTimeOut} ({lateOrEarly})
          </Text>
        </View>
      </View>
    </View>
  );
};

const Options = ({ formik, title, field, types, valueChange, placeholder, value }) => {
  return (
    <View>
      <Select
        formik={formik}
        value={value}
        title={title}
        fieldName={field}
        onChange={valueChange ? valueChange : (value) => formik.setFieldValue(field, value)}
        items={types}
        placeHolder={placeholder}
      />
    </View>
  );
};

const Reason = ({ formik, value, fieldName, onChangeText }) => {
  return (
    <View>
      <Input
        formik={formik}
        title="Reason"
        fieldName={fieldName}
        placeHolder="Enter your reason"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const LateOrEarlyTime = ({
  formik,
  arrayList,
  titleTime,
  time,
  title,
  inputValue,
  inputOnChangeText,
  selectOnValueChange,
  titleDuty,
  timeDuty,
  timeLateOrEarly,
  placeholder,
  fieldOption,
}) => {
  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Clock
        titleDuty={titleDuty}
        timeDuty={timeDuty}
        titleClock={titleTime}
        timeInOrTimeOut={time}
        lateOrEarly={timeLateOrEarly}
      />
      <Options
        formik={formik}
        title={title}
        value={inputValue}
        valueChange={selectOnValueChange}
        types={arrayList}
        placeholder={placeholder}
        field={fieldOption}
      />
      <Reason formik={formik} value={inputValue} onChangeText={inputOnChangeText} />
      <FormButton
        size="sm"
        variant="solid"
        fontSize={12}
        fontColor="white"
        isSubmitting={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        <Text style={{ color: "#FFFFFF" }}>Save</Text>
      </FormButton>
    </View>
  );
};

const LateAndEarlyTime = ({
  tabs,
  tabValue,
  onChangeTab,
  onDuty,
  timeIn,
  late,
  formik,
  lateTypes,
  offDuty,
  timeOut,
  early,
  earlyTypes,
}) => {
  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />
      {tabValue === "late" ? (
        <>
          <View style={styles.clock}>
            <View>
              <Text style={[{ fontSize: 12 }, TextProps]}>On Duty</Text>
              <Text style={[{ fontSize: 12 }, TextProps]}>{onDuty}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View>
                <Text style={[{ fontSize: 12 }, TextProps]}>Clock-in Time</Text>
                <Text style={[{ fontSize: 12 }, TextProps]}>
                  {timeIn} ({late})
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Select
              formik={formik}
              value={formik.values.late_type}
              fieldName="late_type"
              title="Late Type"
              items={lateTypes}
              placeHolder="Select Late Type"
              onChange={(value) => formik.setFieldValue("late_type", value)}
            />
          </View>
          <View>
            <Input
              formik={formik}
              title="Reason"
              fieldName="late_reason"
              placeHolder="Enter your reason"
              value={formik.values.late_reason}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.clock}>
            <View>
              <Text style={[{ fontSize: 12 }, TextProps]}>Off Duty</Text>
              <Text style={[{ fontSize: 12 }, TextProps]}>{offDuty}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View>
                <Text style={[{ fontSize: 12 }, TextProps]}>Clock-out Time</Text>
                <Text style={[{ fontSize: 12 }, TextProps]}>
                  {timeOut} ({early})
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Select
              formik={formik}
              value={formik.values.early_type}
              fieldName="early_type"
              items={earlyTypes}
              title="Early Type"
              placeHolder="Select Early Type"
              onChange={(value) => formik.setFieldValue("early_type", value)}
            />
          </View>
          <View>
            <Input
              formik={formik}
              title="Reason"
              fieldName="early_reason"
              placeHolder="Enter your reason"
              value={formik.values.early_reason}
            />
          </View>
        </>
      )}
      <FormButton
        size="sm"
        variant="solid"
        fontSize={12}
        fontColor="white"
        isSubmitting={formik.isSubmitting}
        onPress={formik.handleSubmit}
      >
        <Text style={{ color: "#FFFFFF" }}>Save</Text>
      </FormButton>
    </View>
  );
};

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <View style={{ width: "100%", gap: 10 }}>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>Attendance Type</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{type}</Text>
      </View>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>Reason</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{reason}</Text>
      </View>
    </View>
  );
};
