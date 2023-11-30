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
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";

const NewLeaveRequest = ({ route }) => {
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const [formError, setFormError] = useState(true);

  const { width, height } = Dimensions.get("window");

  const { refetchPersonalLeave, employeeId } = route.params;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const toast = useToast();

  const navigation = useNavigation();

  const { data: leaveType } = useFetch("/hr/leaves");

  const personalLeaveData = [
    {
      id: 1,
      name: "Available Leave",
      icon: "clipboard-outline",
      qty: availableLeaves?.available_leave,
      backgroundColor: "#E8E9EB",
      iconColor: "#377893",
    },
    // {
    //   id: 2,
    //   name: "Available Day-off",
    //   icon: "clipboard-pulse-outline",
    //   qty: availableLeaves?.day_off_leave,
    //   backgroundColor: "#FAF6E8",
    //   iconColor: "#FFD240",
    // },
  ];

  const {
    data: leaveHistory,
    refetch: refetchLeaveHistory,
    isFetching: leaveHistoryIsFetching,
  } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);

  /**
   * Calculate available leave quota and day-off
   */
  const filterAvailableLeaveHistory = () => {
    let availableLeave = [];
    leaveHistory?.data.map((item) => {
      if (item?.active) {
        const index = availableLeave.findIndex((leave) => leave?.leave_name === item?.name); // Fix: use item?.name instead of leaveHistory?.name
        if (availableLeave.length > 0 && index > -1) {
          availableLeave[index].quota += item?.quota;
        } else {
          availableLeave.push({ leave_name: item?.leave_name, quota: item?.quota });
        }
      }
    });

    if (availableLeave.length > 0) {
      setAvailableLeaves(availableLeave);
    }

    // let sumAvailableLeave = 0;

    // const availableLeave = leaveHistory?.data.filter((leave) => leave.active);

    // if (availableLeave?.length > 0) {
    //   sumAvailableLeave = availableLeave?.reduce((val, obj) => {
    //     return Number(val) + Number(obj.quota);
    //   }, 0);
    // }

    // setAvailableLeaves(() => {
    //   return { available_leave: sumAvailableLeave };
    // });
  };

  /**
   * Calculate leave quota handler
   * @param {*} action
   */

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
      toast.show({
        render: () => {
          return <SuccessToast message="Leave request available" />;
        },
      });
      setFormError(false);
    } catch (err) {
      console.log(err);
      toast.show({
        render: () => {
          return <ErrorToast message="Quota is not enough" />;
        },
      });
    }
  };

  /**
   * Submit leave request handler
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */

  const leaveRequestAddHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/leave-requests`, form);
      refetchPersonalLeave();
      refetchLeaveHistory();
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Request Created`} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={`Creating failed,${err.response.data.message}`} close={() => toast.close(id)} />;
        },
      });
    }
  };

  /**
   * Create leave request handler
   */
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
      // resetForm();
    },
  });

  /**
   * Begin and End date Leave handler
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
  };

  useEffect(() => {
    if (formik.values.leave_id && formik.values.begin_date && formik.values.end_date && dateChanges) {
      countLeave();
      setDateChanges(false);
    }
    if (!formik.isSubmitting && formik.status === "success") {
      navigation.goBack();
    }
  }, [
    formik.values.leave_id,
    formik.values.begin_date,
    formik.values.end_date,
    formik.isSubmitting,
    formik.status,
    dateChanges,
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
      <Box w={width} height={height} bgColor="#FFFFFF" p={3}>
        <PageHeader
          title="New Leave Request"
          onPress={
            formik.values.leave_id || formik.values.reason || formik.values.begin_date || formik.values.end_date
              ? !formik.isSubmitting && formik.status !== "processing" && toggleReturnModal
              : () => {
                  !formik.isSubmitting && formik.status !== "processing" && formik.resetForm();
                  navigation.goBack();
                }
          }
        />

        <ReturnConfirmationModal
          isOpen={returnModalIsOpen}
          toggle={toggleReturnModal}
          onPress={() => {
            toggleReturnModal();
            navigation.navigate("Dashboard");
          }}
          description="If you return, It will be discarded"
        />

        <Flex alignItems="center" justifyContent="center" gap={3} flexDir="row" my={3}>
          {availableLeaves?.map((item, index) => {
            return (
              <Box key={index} alignItems="center" justifyContent="center" gap={2}>
                <Text fontWeight={500} fontSize={20}>
                  {item.quota}
                </Text>
                <Text width={20} height={10} fontWeight={400} fontSize={12} color="#8A9099" textAlign="center">
                  {item.leave_name}
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
