import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";

import { Actionsheet, Icon, Select } from "native-base";
import { StyleSheet, View, Text } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";
import Tabs from "../../shared/Tabs";
import Input from "../../shared/Forms/Input";

const AttendanceAction = ({
  reportIsOpen,
  toggleReport,
  date,
  onSubmit,
  hasClockInAndOut,
  hasLateWithoutReason,
  hasEarlyWithoutReason,
  hasLateAndEarlyWithoutReason,
  hasSubmittedBothReports,
  hasSubmittedReportAlpa,
  hasSubmittedLateReport,
  hasSubmittedEarlyReport,
  notAttend,
  isLeave,
  isPermit,
  CURRENT_DATE,
}) => {
  const [tabValue, setTabValue] = useState("late");
  /**
   * Late type Handler
   */
  const lateType = [
    { id: 1, name: "Late" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  /**
   * Early type Handler
   */
  const earlyType = [
    { id: 1, name: "Went Home Early" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

  const alpaType = [
    { id: 1, name: "Alpa" },
    { id: 2, name: "Sick" },
    { id: 3, name: "Permit" },
    { id: 4, name: "Other" },
  ];

  const tabs = useMemo(() => {
    return [{ title: "late" }, { title: "early" }];
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
    <>
      <Actionsheet
        isOpen={reportIsOpen}
        onClose={() => !formik.isSubmitting && formik.status !== "processing" && toggleReport(formik.resetForm)}
      >
        <Actionsheet.Content>
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
              errorForType={formik.errors.late_type}
              errorForReason={formik.errors.late_reason}
              titleDuty="On Duty"
              timeDuty={date?.onDuty}
              titleLateOrEarly="Late"
              timeLateOrEarly={date?.late}
              placeholder="Select Late Type"
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
              errorForType={formik.errors.early_type}
              errorForReason={formik.errors.early_reason}
              titleDuty="Off Duty"
              timeDuty={date?.offDuty}
              titleLateOrEarly="Early"
              timeLateOrEarly={date?.early}
              placeholder="Select Early Type"
            />
          )}

          {/* If report submitted either Late or Early or Alpa */}
          {hasSubmittedLateReport && (
            <View style={{ width: "95%", gap: 3 }}>
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
              </View>
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

          {hasSubmittedEarlyReport && (
            <View style={{ width: "95%", gap: 3 }}>
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
              </View>
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

          {hasSubmittedReportAlpa && (
            <View style={{ width: "95%", gap: 3 }}>
              <View style={{ width: "100%", gap: 5 }}>
                <Options
                  formik={formik}
                  title="Alpa Type"
                  field={"att_type"}
                  defaultValue={date?.attendanceType}
                  types={alpaType}
                  valueChange={(value) => formik.setFieldValue("att_type", value)}
                />
                <Reason
                  formik={formik}
                  value={formik.values.att_reason}
                  defaultValue={date?.attendanceReason}
                  fieldName="att_reason"
                />
              </View>
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

          {hasLateAndEarlyWithoutReason && (
            <View style={{ width: "95%", gap: 3 }}>
              <View style={{ width: "100%", gap: 5 }}>
                <Tabs
                  tabs={tabs}
                  value={tabValue}
                  onChange={onChangeTab}
                  justify="space-evenly"
                  flexDir="row"
                  gap={2}
                />
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
                      <Text>Late Type</Text>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("late_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="late_type"
                        placeholder={"Select Late Type"}
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.lateType}
                      >
                        {lateType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </View>
                    <View>
                      <Input
                        formik={formik}
                        title="Reason"
                        fieldName={"late_reason"}
                        placeholder={"Enter your reason"}
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
                      <Text>Early Type</Text>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("early_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="early_type"
                        placeholder={"Select Early Type"}
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.earlyType}
                      >
                        {earlyType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </View>
                    <View>
                      <Input
                        formik={formik}
                        title="Reason"
                        fieldName={"early_reason"}
                        placeholder={"Enter your reason"}
                        value={formik.values.early_reason}
                        defaultValue={date?.earlyReason}
                      />
                    </View>
                  </>
                )}
              </View>
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
            <View style={{ width: "95%", gap: 3 }}>
              <View style={{ width: "100%", gap: 5 }}>
                <Tabs
                  tabs={tabs}
                  value={tabValue}
                  onChange={onChangeTab}
                  justify="space-evenly"
                  flexDir="row"
                  gap={2}
                />
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
                      <Text>Late Type</Text>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("late_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="late_type"
                        placeholder={"Select Late Type"}
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.lateType}
                      >
                        {lateType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </View>
                    <View>
                      <Input
                        formik={formik}
                        title="Reason"
                        fieldName={"late_reason"}
                        placeholder={"Enter your reason"}
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
                      <Text>Early Type</Text>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("early_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="early_type"
                        placeholder={"Select Early Type"}
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.earlyType}
                      >
                        {earlyType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </View>
                    <View>
                      <Input
                        formik={formik}
                        title="Reason"
                        fieldName={"early_reason"}
                        placeholder={"Enter your reason"}
                        value={formik.values.early_reason}
                        defaultValue={date?.earlyReason}
                      />
                    </View>
                  </>
                )}
              </View>
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

          {/* If did not clock-in (Alpa) */}
          {notAttend && (
            <View style={{ width: "95%", gap: 3 }}>
              <View style={{ width: "100%", gap: 5 }}>
                <Options
                  formik={formik}
                  title="Alpa Type"
                  field={"att_type"}
                  types={alpaType}
                  defaultValue="Alpa"
                  valueChange={(value) => formik.setFieldValue("att_type", value)}
                />
                <Reason formik={formik} value={formik.values.att_reason} fieldName="att_reason" />
              </View>
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

          {/* If attendance type is Permit */}
          {isPermit && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

          {date?.dayType === "Work Day" && !date?.timeIn && date?.date === CURRENT_DATE && (
            <View style={{ width: "95%", gap: 3 }}>
              <View style={{ width: "100%", gap: 5 }}>
                <View>
                  <Text>Please Clock-in</Text>
                </View>
              </View>
            </View>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default AttendanceAction;

const LateOrEarlyTime = ({
  formik,
  arrayList,
  titleTime,
  time,
  title,
  inputValue,
  inputOnChangeText,
  selectOnValueChange,
  errorForType,
  errorForReason,
  titleDuty,
  timeDuty,
  timeLateOrEarly,
  placeholder,
}) => {
  return (
    <View style={{ width: "95%", gap: 3 }}>
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
          valueChange={selectOnValueChange}
          types={arrayList}
          placeholder={placeholder}
        />
        <Reason formik={formik} value={inputValue} onChangeText={inputOnChangeText} />
      </View>
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
    <View style={{ width: "95%", gap: 3 }}>
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

const Options = ({ formik, title, field, defaultValue, types, valueChange, placeholder }) => {
  return (
    <View>
      <Text>{title}</Text>
      <Select
        onValueChange={valueChange ? valueChange : (value) => formik.setFieldValue(field, value)}
        borderRadius={15}
        borderWidth={1}
        variant="unstyled"
        key="late_type"
        placeholder={placeholder}
        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        defaultValue={defaultValue}
      >
        {types.map((item) => {
          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
        })}
      </Select>
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
        placeholder={"Enter your reason"}
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
});
