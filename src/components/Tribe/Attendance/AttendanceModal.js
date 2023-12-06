import dayjs from "dayjs";
import { useFormik } from "formik";

import { Button, FormControl, Icon, Input, Modal, Select, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";

const AttendanceModal = ({
  reportIsOpen,
  toggleReport,
  date,
  onSubmit,
  hasClockInAndOut,
  hasLateWithoutReason,
  hasEarlyWithoutReason,
  hasSubmittedReport,
  hasSubmittedBothReports,
  isLeave,
  isPermit,
}) => {
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
    { id: 1, name: "Early" },
    { id: 2, name: "Permit" },
    { id: 3, name: "Other" },
  ];

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
    // validationSchema: yup.object().shape({}),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      onSubmit(date?.id, values, setSubmitting, setStatus);
    },
  });

  return (
    <Modal
      size="xl"
      isOpen={reportIsOpen}
      onClose={() => !formik.isSubmitting && formik.status !== "processing" && toggleReport()}
    >
      <Modal.Content>
        <Modal.CloseButton onPress={() => !formik.isSubmitting && formik.status !== "processing" && toggleReport()} />
        <Modal.Header>{dayjs(date?.date).format("dddd, DD MMM YYYY")}</Modal.Header>

        {/* If employee ontime for Clock in and Clock out */}
        {hasClockInAndOut && (
          <Modal.Body>
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
          </Modal.Body>
        )}

        {/* If employee Clock in late, require Late Report */}

        {hasLateWithoutReason && (
          <LateOrEarlyTime
            arrayList={lateType}
            titleTime="Clock-in Time"
            time={date?.timeIn}
            title="Late Type"
            inputValue={formik.values.late_reason}
            inputOnChangeText={(value) => formik.setFieldValue("late_reason", value)}
            selectOnValueChange={(value) => formik.setFieldValue("late_type", value)}
            errorForType={formik.errors.late_type}
            errorForReason={formik.errors.late_reason}
          />
        )}

        {/* If employee Clock out early, require Early Report */}
        {hasEarlyWithoutReason && (
          <LateOrEarlyTime
            arrayList={earlyType}
            titleTime="Clock-out Time"
            time={date?.timeOut}
            title="Early Type"
            inputValue={formik.values.early_reason}
            inputOnChangeText={(value) => formik.setFieldValue("early_reason", value)}
            selectOnValueChange={(value) => formik.setFieldValue("early_type", value)}
            errorForType={formik.errors.early_type}
            errorForReason={formik.errors.early_reason}
          />
        )}

        {/* If report submitted either Late or Early */}
        {hasSubmittedReport && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>{date?.timeIn ? "Clock-in Time" : "Clock-out Time"}</FormControl.Label>
                  <Text>{date?.timeIn ? date?.timeIn : date?.timeOut}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>{date?.lateType ? "Late Type" : "Early Type"}</FormControl.Label>
                  {/* <Text>{date?.lateType ? date?.lateType : date?.earlyType}</Text> */}
                  <Select
                    onValueChange={(value) => formik.setFieldValue(date?.lateType ? "late_type" : "early_type", value)}
                    borderRadius={15}
                    borderWidth={1}
                    variant="unstyled"
                    key="late_type"
                    placeholder="Select Late Type"
                    dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                    defaultValue={date?.lateType ? date?.lateType : date?.earlyType}
                  >
                    {lateType.map((item) => {
                      return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  {/* <Text>{date?.lateReason ? date?.lateReason : date?.earlyReason}</Text> */}
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.late_reason ? formik.values_late_reason : formik.values.early_reason}
                    onChangeText={(value) =>
                      formik.setFieldValue(date?.lateReason ? "late_reason" : "early_reason", value)
                    }
                    defaultValue={date?.lateReason ? date?.lateReason : date?.earlyReason}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Status</FormControl.Label>
                  <Text>{date?.lateStatus ? date?.lateStatus : date?.earlyStatus}</Text>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {/* If report submitted Late and Early */}
        {hasSubmittedBothReports && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Late Type</FormControl.Label>
                  {/* <Text>{date?.lateType}</Text> */}
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
                  {/* <Text>{date?.lateReason}</Text> */}
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.late_reason}
                    onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                    defaultValue={date?.lateReason}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Status</FormControl.Label>
                  <Text>{date?.lateStatus}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Early Type</FormControl.Label>
                  {/* <Text>{date?.earlyType}</Text> */}
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
                  {/* <Text>{date?.earlyReason}</Text> */}
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.early_reason}
                    onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                    defaultValue={date?.earlyReason}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Status</FormControl.Label>
                  <Text>{date.earlyStatus}</Text>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {/* If attendance type is Leave */}
        {isLeave && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

        {/* If attendance type is Permit */}
        {isPermit && <LeaveOrPermit type={date?.attendanceType} reason={date?.attendanceReason} />}

        <Modal.Footer>
          {
            // (date?.lateType && date?.lateReason && !date?.earlyType && !date?.earlyReason) ||
            // (date?.earlyType && date?.earlyReason && !date?.lateType) ||
            // (date?.earlyType && date?.earlyReason && date?.lateType && date?.earlyType) ||
            date?.attendanceType === "Permit" ||
            date?.attendanceType === "Leave" ||
            (!date?.lateType && !date?.earlyType) ? (
              <Button backgroundColor="red.800" size="sm" variant="outline" onPress={toggleReport}>
                <Text color="#FFFFFF">Close</Text>
              </Button>
            ) : (
              <>
                <Button
                  backgroundColor="red.800"
                  size="sm"
                  variant="outline"
                  onPress={() => {
                    toggleReport(formik.resetForm);
                  }}
                >
                  <Text fontSize={12} fontWeight={500} color="#FFFFFF">
                    Cancel
                  </Text>
                </Button>

                <FormButton
                  children="Save"
                  size="sm"
                  variant="solid"
                  fontSize={12}
                  fontColor="white"
                  isSubmitting={formik.isSubmitting}
                  onPress={formik.handleSubmit}
                />
              </>
            )
          }
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default AttendanceModal;

const LateOrEarlyTime = ({
  arrayList,
  titleTime,
  time,
  title,
  inputValue,
  inputOnChangeText,
  selectOnValueChange,
  errorForType,
  errorForReason,
}) => {
  return (
    <Modal.Body>
      <VStack
        w="95%"
        space={3}
        // pb={keyboardHeight}
      >
        <VStack w="100%" space={2}>
          <FormControl>
            <FormControl.Label>{titleTime}</FormControl.Label>
            <Text>{time}</Text>
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
      </VStack>
    </Modal.Body>
  );
};

const LeaveOrPermit = ({ type, reason }) => {
  return (
    <Modal.Body>
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
    </Modal.Body>
  );
};
