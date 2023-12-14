import dayjs from "dayjs";
import { useFormik } from "formik";

import {
  Actionsheet,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  Select,
  Text,
  VStack,
} from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";
import Tabs from "../../shared/Tabs";
import { useCallback, useEffect, useMemo, useState } from "react";

const AttendanceModal = ({
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
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Clock-in Time</FormControl.Label>
                  <Text>{date?.timeIn}</Text>
                </FormControl>
                {!date?.timeOut ? null : (
                  <FormControl>
                    <FormControl.Label>Clock-out Time</FormControl.Label>
                    <Text>{date?.timeOut}</Text>
                  </FormControl>
                )}
              </VStack>
            </VStack>
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
            />
          )}
          {/* If report submitted either Late or Early or Alpa */}
          {hasSubmittedLateReport && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <FormControl.Label>On Duty</FormControl.Label>
                    <Text>{date?.onDuty}</Text>
                  </Box>
                  <Flex gap={5} flexDirection="row" alignItems="center">
                    <Box>
                      <FormControl.Label>Clock-in Time</FormControl.Label>
                      <Text>
                        {date?.timeIn} ({date?.late})
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Late Type</FormControl.Label>
                  <Select
                    onValueChange={(value) => formik.setFieldValue("late_type", value)}
                    borderRadius={15}
                    borderWidth={1}
                    variant="unstyled"
                    key="late_type"
                    placeholder="Select Late Type"
                    dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    defaultValue={date?.lateType}
                  >
                    {lateType.map((item) => {
                      return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.late_reason}
                    onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                    defaultValue={date?.lateReason}
                  />
                </FormControl>
              </VStack>
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
            </VStack>
          )}
          {hasSubmittedEarlyReport && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <FormControl.Label>Off Duty</FormControl.Label>
                    <Text>{date?.offDuty}</Text>
                  </Box>
                  <Flex gap={5} flexDirection="row" alignItems="center">
                    <Box>
                      <FormControl.Label>Clock-out Time</FormControl.Label>
                      <Text>
                        {date?.timeOut} ({date?.early})
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Early Type</FormControl.Label>
                  <Select
                    onValueChange={(value) => formik.setFieldValue("early_type", value)}
                    borderRadius={15}
                    borderWidth={1}
                    variant="unstyled"
                    key="early_type"
                    placeholder="Select Early Type"
                    dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    defaultValue={date?.earlyType}
                  >
                    {lateType.map((item) => {
                      return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.early_reason}
                    onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                    defaultValue={date?.earlyReason}
                  />
                </FormControl>
              </VStack>
              <FormButton
                children="Save"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              />
            </VStack>
          )}
          {hasSubmittedReportAlpa && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Attendance Type</FormControl.Label>
                  <Input
                    variant="outline"
                    isDisabled={true}
                    placeholder={date?.attendanceType}
                    value={formik.values.att_type}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.att_reason}
                    onChangeText={(value) => formik.setFieldValue("att_reason", value)}
                  />
                </FormControl>
              </VStack>
              <FormButton
                children="Save"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              />
            </VStack>
          )}
          {hasLateAndEarlyWithoutReason && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
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
                    <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormControl.Label>On Duty</FormControl.Label>
                        <Text>{date?.onDuty}</Text>
                      </Box>
                      <Flex gap={5} flexDirection="row" alignItems="center">
                        <Box>
                          <FormControl.Label>Clock-in Time</FormControl.Label>
                          <Text>
                            {date?.timeIn} ({date?.late})
                          </Text>
                        </Box>
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Late Type</FormControl.Label>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("late_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="late_type"
                        placeholder="Select Late Type"
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.lateType}
                      >
                        {lateType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.late_reason}
                        onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                        defaultValue={date?.lateReason}
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormControl.Label>Off Duty</FormControl.Label>
                        <Text>{date?.offDuty}</Text>
                      </Box>
                      <Flex gap={5} flexDirection="row" alignItems="center">
                        <Box>
                          <FormControl.Label>Clock-out Time</FormControl.Label>
                          <Text>
                            {date?.timeOut} ({date?.early})
                          </Text>
                        </Box>
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Early Type</FormControl.Label>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("early_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="early_type"
                        placeholder="Select Early Type"
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date.earlyType}
                      >
                        {earlyType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.early_reason}
                        onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                        defaultValue={date?.earlyReason}
                      />
                    </FormControl>
                  </>
                )}
              </VStack>
              <FormButton
                children="Save"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              />
            </VStack>
          )}
          {/* If report submitted Late and Early */}
          {hasSubmittedBothReports && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
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
                    <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormControl.Label>On Duty</FormControl.Label>
                        <Text>{date?.onDuty}</Text>
                      </Box>
                      <Flex gap={5} flexDirection="row" alignItems="center">
                        <Box>
                          <FormControl.Label>Clock-in Time</FormControl.Label>
                          <Text>
                            {date?.timeIn} ({date?.late})
                          </Text>
                        </Box>
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Late Type</FormControl.Label>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("late_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="late_type"
                        placeholder="Select Late Type"
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date?.lateType}
                      >
                        {lateType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.late_reason}
                        onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                        defaultValue={date?.lateReason}
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormControl.Label>Off Duty</FormControl.Label>
                        <Text>{date?.offDuty}</Text>
                      </Box>
                      <Flex gap={5} flexDirection="row" alignItems="center">
                        <Box>
                          <FormControl.Label>Clock-out Time</FormControl.Label>
                          <Text>
                            {date?.timeOut} ({date?.early})
                          </Text>
                        </Box>
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Early Type</FormControl.Label>
                      <Select
                        onValueChange={(value) => formik.setFieldValue("early_type", value)}
                        borderRadius={15}
                        borderWidth={1}
                        variant="unstyled"
                        key="early_type"
                        placeholder="Select Early Type"
                        dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                        defaultValue={date.earlyType}
                      >
                        {earlyType.map((item) => {
                          return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Reason</FormControl.Label>
                      <Input
                        variant="outline"
                        placeholder="Enter your reason"
                        value={formik.values.early_reason}
                        onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                        defaultValue={date?.earlyReason}
                      />
                    </FormControl>
                  </>
                )}
              </VStack>
              <FormButton
                children="Save"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              />
            </VStack>
          )}
          {/* If did not clock-in (Alpa) */}
          {notAttend && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Attendance Type</FormControl.Label>
                  <Input
                    variant="outline"
                    isDisabled={true}
                    placeholder={date?.attendanceType}
                    value={formik.values.att_type}
                  />
                </FormControl>

                <FormControl.Label>Reason</FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Enter your reason"
                  value={formik.values.att_reason}
                  onChangeText={(value) => formik.setFieldValue("att_reason", value)}
                />
              </VStack>
              <FormButton
                children="Save"
                size="sm"
                variant="solid"
                fontSize={12}
                fontColor="white"
                isSubmitting={formik.isSubmitting}
                onPress={formik.handleSubmit}
              />
            </VStack>
          )}
          {/* If attendance type is Leave */}
          {isLeave && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}
          {/* If attendance type is Permit */}
          {isPermit && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}
          {date?.dayType === "Work Day" && !date?.timeIn && date?.date === CURRENT_DATE && (
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <Text>Please Clock-in</Text>
                </FormControl>
              </VStack>
            </VStack>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default AttendanceModal;

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
  titleLateOrEarly,
  timeLateOrEarly,
}) => {
  return (
    <VStack
      w="95%"
      space={3}
      // pb={keyboardHeight}
    >
      <VStack w="100%" space={2}>
        <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            <FormControl.Label>{titleDuty}</FormControl.Label>
            <Text>{timeDuty}</Text>
          </Box>
          <Flex gap={5} flexDirection="row" alignItems="center">
            <Box>
              <FormControl.Label>{titleTime}</FormControl.Label>
              <Text>
                {time} ({timeLateOrEarly})
              </Text>
            </Box>
          </Flex>
        </FormControl>
        <FormControl>
          <FormControl.Label>{title}</FormControl.Label>
        </FormControl>
        <Select
          onValueChange={selectOnValueChange}
          borderRadius={15}
          borderWidth={1}
          variant="unstyled"
          key="late_type"
          placeholder="Select Late Type"
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          {arrayList.map((item) => {
            return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
          })}
        </Select>
        <FormControl mt={-2} isInvalid={errorForType}>
          <FormControl.ErrorMessage>{errorForType}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={errorForReason}>
          <FormControl.Label>Reason</FormControl.Label>
          <Input
            variant="outline"
            placeholder="Enter your reason"
            value={inputValue}
            onChangeText={inputOnChangeText}
          />
          <FormControl.ErrorMessage>{errorForReason}</FormControl.ErrorMessage>
        </FormControl>
      </VStack>
      <FormButton
        children="Save"
        size="sm"
        variant="solid"
        fontSize={12}
        fontColor="white"
        isSubmitting={formik.isSubmitting}
        onPress={formik.handleSubmit}
      />
    </VStack>
  );
};

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <VStack w="95%" space={3}>
      <VStack w="100%" space={2}>
        <FormControl>
          <FormControl.Label>Attendance Type</FormControl.Label>
          <Text>{type}</Text>
        </FormControl>
        <FormControl>
          <FormControl.Label>Reason</FormControl.Label>
          <Text>{reason}</Text>
        </FormControl>
      </VStack>
    </VStack>
  );
};
