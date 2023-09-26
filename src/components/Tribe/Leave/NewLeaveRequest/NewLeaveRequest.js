import { Box, Flex, FormControl, Icon, Input, Pressable, Select, Text, useToast } from "native-base";
import { Dimensions, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import FormButton from "../../../shared/FormButton";
import { useFetch } from "../../../../hooks/useFetch";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import { useEffect } from "react";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const NewLeaveRequest = ({
  onClose,
  availableLeavePersonal,
  pendingApproval,
  approved,
  refetchLeavePersonal,
  approver,
  approverImage,
  employeeId,
}) => {
  const [date, setDate] = useState(dayjs());
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const { width, height } = Dimensions.get("window");
  const [formError, setFormError] = useState(true);
  const navigation = useNavigation();
  const toast = useToast();

  const { data: leaveType } = useFetch("/hr/leaves");
  const { data: leaveHistory, refetchLeaveHistory } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);
  console.log("his", leaveHistory?.data);

  const leaveRequestAddHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/leave-requests`, form);
      console.log("add", res);
      refetchLeavePersonal();
      refetchLeaveHistory();
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: () => {
          return <SuccessToast message={`Request Created`} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={err.response.data.message} />;
        },
      });
    }
  };

  const filterAvailableHistory = () => {
    let sumAvailableLeave = 0;
    let sumDayOffLeave = 0;
    const availableLeave = leaveHistory?.data.filter((leave) => leave.leave_id === 1 && leave.active);

    if (availableLeave.length > 0) {
      sumAvailableLeave = availableLeave?.reduce((val, obj) => {
        return Number(val) + Number(obj.quota);
      }, 0);
    }
    const dayOffLeave = leaveHistory?.data.filter((leave) => leave.leave_id === 10 && leave.active);
    if (dayOffLeave.length > 0) {
      sumDayOffLeave = dayOffLeave?.reduce((val, obj) => {
        return Number(val) + Number(obj.quota);
      }, 0);
    }
    setAvailableLeaves(() => {
      return { available_leave: sumAvailableLeave, day_off_leave: sumDayOffLeave };
    });
  };

  const countLeave = async (action = null) => {
    try {
      const res = await axiosInstance.post(`/hr/leave-requests/count-leave`, {
        leave_id: formik.values.leave_id,
        begin_date: formik.values.end_date,
      });
      console.log("leave", res);
      formik.setFieldValue("days", res.days);
      formik.setFieldValue("begin_date", dayjs(res.data.begin_date).format("YYYY-MM-DD"));
      formik.setFieldValue("end", dayjs(res.data.end_date).format("YYYY-MM-DD"));
      toast.show({
        render: () => {
          return <SuccessToast message={`You can continue to sumbit the form`} />;
        },
      });
      setFormError(false);
    } catch (err) {
      console.log(err);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      leave_id: "",
      begin_date: "",
      end_date: "",
      days: "",
      reason: "",
    },
    validationSchema: yup.object().shape({
      leave_id: yup.string().required("Leave Type is required"),
      reason: yup.string().required("Purpose of Leave is required"),
      begin_date: yup.date().required("Start date is required"),
      end_date: yup.date().min(yup.ref("begin_date"), "End date can't be less than start date"),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      console.log("value", values);
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      setStatus("processing");
      leaveRequestAddHandler(formData, setSubmitting, setStatus);
      resetForm();
    },
  });

  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  useEffect(() => {
    // if (!formik.isSubmitting && formik.status === "success") {
    // onClose(formik.resetForm);

    if (formik.values.leave_id && dateChanges) {
      countLeave();
      setDateChanges(false);
    }
    // }
  }, [
    formik.values.leave_id,
    dateChanges,
    // formik.isSubmitting,
    // formik.status
  ]);

  useEffect(() => {
    if (selectedGenerateType === null) {
      setDateChanges(true);
    }
  }, [selectedGenerateType]);

  useEffect(() => {
    setSelectedGenerateType(() => {
      const selectedLeave = leaveType?.data.find((leave) => leave.id === formik.values.leave_id);
      console.log(selectedLeave?.generate_type);
      return selectedLeave?.generate_type;
    });
  }, [formik.values.leave_id]);

  useEffect(() => {
    filterAvailableHistory();
    console.log(availableLeaves);
  }, [leaveHistory?.data]);

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="white" p={5}>
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Pressable onPress={() => onClose()}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="lg" color="black" />
          </Pressable>
          <Text fontSize={16} fontWeight={500}>
            New Leave Request
          </Text>
        </Flex>
        <Flex style={styles.container}>
          <Flex gap={1} height="110px" width="60px">
            <Box
              flex={1}
              minHeight="60px"
              borderRadius={15}
              backgroundColor="#E8E9EB"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={<MaterialCommunityIcons name="clipboard-outline" />} color="#377893" size={30} />
            </Box>
            <Text fontWeight={500} fontSize="20px" color="#3F434A" textAlign="center">
              {availableLeavePersonal}
            </Text>
            <Text fontWeight={400} fontSize="12px" color="#8A9099" textAlign="center">
              Available Leave
            </Text>
          </Flex>
        </Flex>
        <Flex gap={17} mt={22}>
          <FormControl isInvalid={formik.errors.leave_id}>
            <FormControl.Label>Leave Type</FormControl.Label>

            <Select
              selectedValue={formik.values.leave_id}
              onValueChange={(value) => formik.setFieldValue("leave_id", value)}
              borderRadius={15}
              key="leave_id"
              placeholder="Select Leave type"
              dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
            >
              {leaveType?.data.map((item) => {
                return <Select.Item label={item?.name} value={item?.id} key={item?.id} />;
              })}
            </Select>
            <FormControl.ErrorMessage>{formik.errors.leave_id}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.reason}>
            <FormControl.Label>Purpose of Leaving</FormControl.Label>
            <Input
              value={formik.values.reason}
              h={100}
              onChangeText={(value) => formik.setFieldValue("reason", value)}
              placeholder="Input purpose"
            />
            <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.begin_date}>
            <FormControl.Label>Start Date</FormControl.Label>
            <CustomDateTimePicker
              defaultValue={formik.values.begin_date}
              onChange={
                //   (value) => {
                //   formik.setFieldValue("begin_date", dayjs(value).format("YYYY-MM-DD"));
                //   setDateChanges(true);
                // }
                onChangeStartDate
              }
              disabled={!formik.values.leave_id}
            />
            <FormControl.ErrorMessage>{formik.errors.begin_date}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.end_date}>
            <FormControl.Label>End Date</FormControl.Label>
            <CustomDateTimePicker
              defaultValue={formik.values.end_date}
              onChange={
                //   (value) => {
                //   formik.setFieldValue("end_date", dayjs(value).format("YYYY-MM-DD"));
                //   setDateChanges(true);
                // }
                onChangeEndDate
              }
              disabled={!formik.values.leave_id || !selectedGenerateType}
            />
            <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <FormControl.Label>Approver</FormControl.Label>
            <Flex alignItems="center" flexDir="row">
              <AvatarPlaceholder name={approver} image={approverImage} size="sm" />
              <Text>{approver}</Text>
            </Flex>
          </FormControl>

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text color="white">Submit</Text>
          </FormButton>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewLeaveRequest;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
