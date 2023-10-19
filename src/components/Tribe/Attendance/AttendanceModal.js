import dayjs from "dayjs";

import { Button, FormControl, Icon, Input, Modal, Select, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FormButton from "../../shared/FormButton";

const AttendanceModal = ({ reportIsOpen, toggleReport, date, formik }) => {
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

  return (
    <Modal size="xl" isOpen={reportIsOpen} onClose={toggleReport}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{dayjs(date?.date).format("dddd, DD MMM YYYY")}</Modal.Header>

        {/* If employee Clock in late, require Late Report */}
        {date?.late && date?.lateType && !date?.lateReason && (
          <Modal.Body>
            <VStack
              w="95%"
              space={3}
              // pb={keyboardHeight}
            >
              <VStack w="100%" space={2}>
                <FormControl isInvalid={formik.errors.late_type}>
                  <FormControl.Label>Late Type</FormControl.Label>
                </FormControl>
                <Select
                  onValueChange={(value) => formik.setFieldValue("late_type", value)}
                  borderRadius={15}
                  borderWidth={1}
                  variant="unstyled"
                  key="late_type"
                  placeholder="Select Late Type"
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  {lateType.map((item) => {
                    return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                  })}
                </Select>
                <FormControl mt={-2} isInvalid={formik.errors.late_type}>
                  <FormControl.ErrorMessage>{formik.errors.late_type}</FormControl.ErrorMessage>
                </FormControl>

                <FormControl.Label>Reason</FormControl.Label>
                <FormControl isInvalid={formik.errors.late_reason}>
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.late_reason}
                    onChangeText={(value) => formik.setFieldValue("late_reason", value)}
                  />
                  <FormControl.ErrorMessage>{formik.errors.late_reason}</FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {/* If employee Clock out early, require Early Report */}
        {date?.early && date?.earlyType && !date?.earlyReason && (
          <Modal.Body>
            <VStack
              w="95%"
              space={3}
              // pb={keyboardHeight}
            >
              <VStack w="100%" space={2}>
                <FormControl isInvalid={formik.errors.early_type}>
                  <FormControl.Label>Early Type</FormControl.Label>
                </FormControl>
                <Select
                  onValueChange={(value) => formik.setFieldValue("early_type", value)}
                  borderRadius={15}
                  borderWidth={1}
                  variant="unstyled"
                  key="early_type"
                  placeholder="Select Early Type"
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  {earlyType.map((item) => {
                    return <Select.Item label={item?.name} value={item?.name} key={item?.id} />;
                  })}
                </Select>
                <FormControl mt={-2} isInvalid={formik.errors.early_type}>
                  <FormControl.ErrorMessage>{formik.errors.early_type}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl.Label>Reason</FormControl.Label>

                <FormControl isInvalid={formik.errors.early_reason}>
                  <Input
                    variant="outline"
                    placeholder="Enter your reason"
                    value={formik.values.early_reason}
                    onChangeText={(value) => formik.setFieldValue("early_reason", value)}
                  />
                  <FormControl.ErrorMessage>{formik.errors.early_reason}</FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {/* If report submitted either Late or Early */}
        {((date?.lateReason && !date?.earlyReason) || (date?.earlyReason && !date?.lateReason)) && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
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
                    value={formik.values.late_reason}
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
        {date?.lateReason && date?.earlyReason && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Late Type</FormControl.Label>
                  <Text>{date?.lateType}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Text>{date?.lateReason}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Status</FormControl.Label>
                  <Text>{date?.lateStatus}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Early Type</FormControl.Label>
                  <Text>{date?.earlyType}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Text>{date?.earlyReason}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Status</FormControl.Label>
                  <Text>{date?.earlyStatus}</Text>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {/* If attendance type is Permit or Leave */}

        {date?.attendanceType === "Leave" && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Attendance Type</FormControl.Label>
                  <Text>{date?.attendanceType}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Text>{date?.attendanceReason}</Text>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        {date?.attendanceType === "Permit" && (
          <Modal.Body>
            <VStack w="95%" space={3}>
              <VStack w="100%" space={2}>
                <FormControl>
                  <FormControl.Label>Attendance Type</FormControl.Label>
                  <Text>{date?.attendanceType}</Text>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Reason</FormControl.Label>
                  <Text>{date?.attendanceReason}</Text>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
        )}

        <Modal.Footer>
          {(date?.lateType && date?.lateReason && !date?.earlyType) ||
          (date?.earlyType && date?.earlyReason && !date?.lateType) ||
          (date?.earlyType && date?.earlyReason && date?.lateType && date?.earlyType) ||
          date?.attendanceType === "Permit" ||
          date?.attendanceType === "Leave" ? (
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
                <Text color="#FFFFFF">Cancel</Text>
              </Button>
              <Button size="sm" variant="solid" onPress={formik.handleSubmit}>
                <Text color="#FFFFFF">Save</Text>
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default AttendanceModal;
