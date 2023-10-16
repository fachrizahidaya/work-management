import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import * as yup from "yup";

import { Dimensions, StyleSheet } from "react-native";
import { Box, Flex, Icon, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../../components/shared/PageHeader";
import axiosInstance from "../../../../config/api";
import { useFetch } from "../../../../hooks/useFetch";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";
import NewLeaveRequestForm from "../../../../components/Tribe/Leave/NewLeaveRequestForm";

const NewLeaveRequest = ({ route }) => {
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const [formError, setFormError] = useState(true);

  const { width, height } = Dimensions.get("window");

  const { onClose, availableLeavePersonal, refetchPersonalLeave, approver, approverImage, employeeId } = route.params;

  const toast = useToast();
  const navigation = useNavigation();

  const { data: leaveType } = useFetch("/hr/leaves");

  const {
    data: leaveHistory,
    refetch: refetchLeaveHistory,
    isFetching: leaveHistoryIsFetching,
  } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);

  const filterAvailableLeaveHistory = () => {
    let sumAvailableLeave = 0;
    let sumDayOffLeave = 0;
    const availableLeave = leaveHistory?.data.filter((leave) => leave.leave_id === 1 && leave.active);

    if (availableLeave?.length > 0) {
      sumAvailableLeave = availableLeave?.reduce((val, obj) => {
        return Number(val) + Number(obj.quota);
      }, 0);
    }
    const dayOffLeave = leaveHistory?.data.filter((leave) => leave.leave_id === 10 && leave.active);
    if (dayOffLeave?.length > 0) {
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
        begin_date: formik.values.begin_date,
        end_date: formik.values.end_date,
      });

      formik.setFieldValue("days", res.data.days);
      formik.setFieldValue("begin_date", dayjs(res.data.begin_date).format("YYYY-MM-DD"));
      formik.setFieldValue("end_date", dayjs(res.data.end_date).format("YYYY-MM-DD"));
      // toast.show({
      //   render: () => {
      //     return <SuccessToast message={`You can continue to sumbit the form`} />;
      //   },
      // });
      setFormError(false);
    } catch (err) {
      console.log(err);
    }
  };

  const leaveRequestAddHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/leave-requests`, form);

      refetchPersonalLeave();
      refetchLeaveHistory();
      setSubmitting(false);
      setStatus("success");

      toast.show({
        render: () => {
          return <SuccessToast message={`Request Created`} />;
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={err.response.data.message} />;
        },
        placement: "top",
      });
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
      setStatus("processing");
      leaveRequestAddHandler(values, setSubmitting, setStatus);
      resetForm();
    },
  });

  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  const personalLeaveData = [
    {
      id: 1,
      name: "Available Leave",
      icon: "clipboard-outline",
      qty: availableLeaves?.available_leave,
      backgroundColor: "#E8E9EB",
      iconColor: "#377893",
    },
    {
      id: 2,
      name: "Available Day-off",
      icon: "clipboard-pulse-outline",
      qty: availableLeaves?.day_off_leave,
      backgroundColor: "#FAF6E8",
      iconColor: "#FFD240",
    },
  ];

  useEffect(() => {
    if (formik.values.leave_id && formik.values.begin_date && formik.values.end_date && dateChanges) {
      countLeave();
      setDateChanges(false);
    }
    if (!formik.isSubmitting && formik.status === "success") {
      navigation.navigate("Feed");
    }
  }, [
    formik.values.leave_id,
    formik.values.begin_date,
    formik.values.end_date,
    dateChanges,
    formik.isSubmitting,
    formik.status,
  ]);

  useEffect(() => {
    if (selectedGenerateType === null) {
      setDateChanges(true);
    }
  }, [selectedGenerateType]);

  useEffect(() => {
    setSelectedGenerateType(() => {
      const selectedLeave = leaveType?.data.find((leave) => leave.id === formik.values.leave_id);
      return selectedLeave?.generate_type;
    });
  }, [formik.values.leave_id]);

  useEffect(() => {
    filterAvailableLeaveHistory();
  }, [leaveHistory?.data]);

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="white" p={3}>
        <PageHeader title="New Leave Request" onPress={() => navigation.navigate("Feed")} />

        <Flex alignItems="center" justifyContent="center" gap={3} flexDir="row" my={3}>
          {personalLeaveData.map((item) => {
            return (
              <Box key={item.id} alignItems="center" justifyContent="center" gap={2}>
                <Box
                  backgroundColor={item.backgroundColor}
                  alignItems="center"
                  justifyContent="center"
                  width={60}
                  height={60}
                  borderRadius={15}
                >
                  <Icon as={<MaterialCommunityIcons name={item.icon} />} size={10} color={item.iconColor} />
                </Box>
                <Text fontWeight={500} fontSize={20}>
                  {item.qty}
                </Text>
                <Text width={20} height={10} fontWeight={400} fontSize={12} color="#8A9099" textAlign="center">
                  {item.name}
                </Text>
              </Box>
            );
          })}
        </Flex>

        <NewLeaveRequestForm
          formik={formik}
          leaveType={leaveType}
          onChangeEndDate={onChangeEndDate}
          onChangeStartDate={onChangeStartDate}
          selectedGenerateType={selectedGenerateType}
        />
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
  },
});
