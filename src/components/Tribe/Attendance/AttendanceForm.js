import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";

import { StyleSheet, View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import FormButton from "../../shared/FormButton";
import Tabs from "../../shared/Tabs";
import Input from "../../shared/Forms/Input";
import Select from "../../shared/Forms/Select";

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
      <View style={styles.wrapper}>
        {/* If employee ontime for Clock in and Clock out */}
        {hasClockInAndOut && (
          <View style={{ width: "95%", gap: 3 }}>
            <View style={{ width: "100%", gap: 5 }}>
              <View style={styles.clock}>
                <View>
                  <Text>Clock-in Time</Text>
                  <Text>{date?.timeIn}</Text>
                </View>
                {!date?.timeOut ? null : (
                  <View>
                    <Text>Clock-out Time</Text>
                    <Text>{date?.timeOut}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

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
          <View style={{ width: "100%", gap: 5 }}>
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
              defaultValue={date?.lateType}
              types={lateType}
              valueChange={(value) => formik.setFieldValue("late_type", value)}
            />
            <Reason
              formik={formik}
              value={formik.values.late_reason}
              defaultValue={date?.lateReason}
              fieldName="late_reason"
            />
            <FormButton
              width="full"
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If report submitted for Early */}
        {hasSubmittedEarlyReport && (
          <View style={{ width: "100%", gap: 5 }}>
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
              defaultValue={date?.earlyType}
              types={earlyType}
              valueChange={(value) => formik.setFieldValue("early_type", value)}
            />
            <Reason
              formik={formik}
              value={formik.values.late_reason}
              defaultValue={date?.lateReason}
              fieldName="early_reason"
            />
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If report submitted for Alpa */}
        {hasSubmittedReportAlpa && (
          <View style={{ width: "100%", gap: 5 }}>
            <Options
              formik={formik}
              title="Unattendance Type"
              field="att_type"
              defaultValue={date?.attendanceType}
              types={alpaType}
              value={formik.values.att_type}
              valueChange={(value) => formik.setFieldValue("att_type", value)}
            />
            <Reason
              formik={formik}
              value={formik.values.att_reason}
              defaultValue={date?.attendanceReason}
              fieldName="att_reason"
            />
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If not yet submit report for Late and Early */}
        {hasLateAndEarlyWithoutReason && (
          <View style={{ width: "100%", gap: 5 }}>
            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />
            {tabValue === "late" ? (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>On Duty</Text>
                    <Text>{date?.onDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-in Time</Text>
                      <Text>
                        {date?.timeIn} ({date?.late})
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Select
                    formik={formik}
                    value={formik.values.late_type}
                    title="Late Type"
                    fieldName="late_type"
                    items={lateType}
                    placeHolder="Select Late Type"
                    defaultValue={date?.lateType}
                    onChange={(value) => formik.setFieldValue("late_type", value)}
                  />
                </View>
                <View>
                  <Input
                    formik={formik}
                    title="Reason"
                    fieldName={"late_reason"}
                    placeHolder="Enter your reason"
                    value={formik.values.late_reason}
                    defaultValue={date?.lateReason}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>On Duty</Text>
                    <Text>{date?.offDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-out Time</Text>
                      <Text>
                        {date?.timeOut} ({date?.early})
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Select
                    formik={formik}
                    value={formik.values.early_type}
                    title="Early Type"
                    fieldName="early_type"
                    items={earlyType}
                    placeHolder="Select Early Type"
                    defaultValue={date?.earlyType}
                    onChange={(value) => formik.setFieldValue("early_type", value)}
                  />
                </View>
                <View>
                  <Input
                    formik={formik}
                    title="Reason"
                    fieldName={"early_reason"}
                    placeHolder="Enter your reason"
                    value={formik.values.early_reason}
                    defaultValue={date?.earlyReason}
                  />
                </View>
              </>
            )}
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {hasSubmittedLateNotEarly && (
          <View style={{ width: "100%", gap: 5 }}>
            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />
            {tabValue === "late" ? (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>On Duty</Text>
                    <Text>{date?.onDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-in Time</Text>
                      <Text>
                        {date?.timeIn} ({date?.late})
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
                    items={lateType}
                    placeHolder="Select Late Type"
                    defaultValue={date?.lateType}
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
                    defaultValue={date?.lateReason}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>Off Duty</Text>
                    <Text>{date?.offDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-out Time</Text>
                      <Text>
                        {date?.timeOut} ({date?.early})
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Select
                    formik={formik}
                    value={formik.values.early_type}
                    fieldName="early_type"
                    items={earlyType}
                    title="Early Type"
                    placeHolder="Select Early Type"
                    defaultValue={date?.earlyType}
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
                    defaultValue={date?.earlyReason}
                  />
                </View>
              </>
            )}
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {hasSubmittedEarlyNotLate && (
          <View style={{ width: "100%", gap: 5 }}>
            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />
            {tabValue === "late" ? (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>On Duty</Text>
                    <Text>{date?.onDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-in Time</Text>
                      <Text>
                        {date?.timeIn} ({date?.late})
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
                    items={lateType}
                    placeHolder="Select Late Type"
                    defaultValue={date?.lateType}
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
                    defaultValue={date?.lateReason}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>Off Duty</Text>
                    <Text>{date?.offDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-out Time</Text>
                      <Text>
                        {date?.timeOut} ({date?.early})
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Select
                    formik={formik}
                    value={formik.values.early_type}
                    fieldName="early_type"
                    items={earlyType}
                    title="Early Type"
                    placeHolder="Select Early Type"
                    defaultValue={date?.earlyType}
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
                    defaultValue={date?.earlyReason}
                  />
                </View>
              </>
            )}
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If report submitted Late and Early */}
        {hasSubmittedBothReports && (
          <View style={{ width: "100%", gap: 5 }}>
            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />
            {tabValue === "late" ? (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>On Duty</Text>
                    <Text>{date?.onDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-in Time</Text>
                      <Text>
                        {date?.timeIn} ({date?.late})
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
                    items={lateType}
                    placeHolder="Select Late Type"
                    defaultValue={date?.lateType}
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
                    defaultValue={date?.lateReason}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.clock}>
                  <View>
                    <Text>Off Duty</Text>
                    <Text>{date?.offDuty}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <View>
                      <Text>Clock-out Time</Text>
                      <Text>
                        {date?.timeOut} ({date?.early})
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Select
                    formik={formik}
                    value={formik.values.early_type}
                    fieldName="early_type"
                    items={earlyType}
                    title="Early Type"
                    placeHolder="Select Early Type"
                    defaultValue={date?.earlyType}
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
                    defaultValue={date?.earlyReason}
                  />
                </View>
              </>
            )}
            <FormButton
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If Alpa */}
        {notAttend && (
          <View style={{ width: "100%", gap: 5 }}>
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
              children="Save"
              size="sm"
              variant="solid"
              fontSize={12}
              fontColor="white"
              isSubmitting={formik.isSubmitting}
              onPress={formik.handleSubmit}
            />
          </View>
        )}

        {/* If attendance type is Leave */}
        {isLeave && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

        {/* If did not clock-in */}
        {date?.dayType === "Work Day" && !date?.timeIn && date?.date === CURRENT_DATE && (
          <View style={{ width: "95%", gap: 3 }}>
            <View style={{ width: "100%", gap: 5 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: "400" }}>Please Clock-in</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

export default AttendanceForm;

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
    <View style={{ width: "100%", gap: 5 }}>
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
        children="Save"
        size="sm"
        variant="solid"
        fontSize={12}
        fontColor="white"
        isSubmitting={formik.isSubmitting}
        onPress={formik.handleSubmit}
      />
    </View>
  );
};

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <View style={{ width: "100%", gap: 5 }}>
      <View>
        <Text>Attendance Type</Text>
        <Text>{type}</Text>
      </View>
      <View>
        <Text>Reason</Text>
        <Text>{reason}</Text>
      </View>
    </View>
  );
};

const Clock = ({ titleDuty, timeDuty, titleClock, timeInOrTimeOut, lateOrEarly }) => {
  return (
    <View style={styles.clock}>
      <View>
        <Text>{titleDuty}</Text>
        <Text>{timeDuty}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <View>
          <Text>{titleClock}</Text>
          <Text>
            {timeInOrTimeOut} ({lateOrEarly})
          </Text>
        </View>
      </View>
    </View>
  );
};

const Options = ({ formik, title, field, defaultValue, types, valueChange, placeholder, value }) => {
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
        defaultValue={defaultValue}
      />
    </View>
  );
};

const Reason = ({ formik, value, defaultValue, fieldName, onChangeText }) => {
  return (
    <View>
      <Input
        formik={formik}
        title="Reason"
        fieldName={fieldName}
        placeHolder="Enter your reason"
        value={value}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
