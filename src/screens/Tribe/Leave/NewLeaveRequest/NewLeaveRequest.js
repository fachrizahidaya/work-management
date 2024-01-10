import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";

import { Dimensions, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../../components/shared/PageHeader";
import axiosInstance from "../../../../config/api";
import { useFetch } from "../../../../hooks/useFetch";
import NewLeaveRequestForm from "../../../../components/Tribe/Leave/NewLeaveRequestForm";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";

const NewLeaveRequest = ({ route }) => {
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formError, setFormError] = useState(true);

  const { width, height } = Dimensions.get("window");

  const { employeeId } = route.params;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const navigation = useNavigation();

  const {
    data: leaveHistory,
    refetch: refetchLeaveHistory,
    isFetching: leaveHistoryIsFetching,
  } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);

  const { data: leaveType } = useFetch("/hr/leaves");
  const leaveOptions = leaveType?.data.map((item) => ({
    value: item.id,
    otherValue: item.name,
    label: item.name,
    active: item.active,
    days: item.days,
    generate_type: item.generate_type,
  }));

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
      setSubmitting(false);
      setStatus("success");
      refetchLeaveHistory();
      Toast.show("Request created", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Calculate leave quota handler
   * @param {*} action
   */
  const countLeave = async (action = null) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/hr/leave-requests/count-leave`, {
        leave_id: formik.values.leave_id,
        begin_date: formik.values.begin_date,
        end_date: formik.values.end_date,
      });

      formik.setFieldValue("days", res.data.days);
      formik.setFieldValue("begin_date", dayjs(res.data.begin_date).format("YYYY-MM-DD"));
      formik.setFieldValue("end_date", dayjs(res.data.end_date).format("YYYY-MM-DD"));
      setIsLoading(false);
      setFormError(false);
      Toast.show("Leave Request available", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Create leave request handler
   */
  const formik = useFormik({
    initialValues: {
      leave_id: "",
      begin_date: dayjs().format("YYYY-MM-DD"),
      end_date: dayjs().format("YYYY-MM-DD"),
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
    },
  });

  /**
   * Begin and End date Leave handler
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
    setDateChanges(true); // every time there is change of date, it will set to true
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
    setDateChanges(true); // every time there is change of date, it will set to true
  };

  useEffect(() => {
    if (formik.values.leave_id && dateChanges) {
      countLeave();
      setDateChanges(false);
    }
  }, [formik.values.leave_id, dateChanges]);

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
    if (!formik.isSubmitting && formik.status === "success") {
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  useEffect(() => {
    filterAvailableLeaveHistory();
  }, [leaveHistory?.data]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <View>
      {isReady ? (
        <View style={{ ...styles.container, width: width, height: height }}>
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
            description="Are you sure want to exit? It will be deleted"
          />

          <View style={styles.history}>
            {leaveHistoryIsFetching ? (
              <View style={{ alignItems: "center", gap: 5 }}>
                <ActivityIndicator />
              </View>
            ) : (
              availableLeaves?.map((item, index) => {
                return (
                  <View key={index} style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "500" }}>{item.quota}</Text>
                    <Text style={styles.name}>{item.leave_name}</Text>
                  </View>
                );
              })
            )}
          </View>

          <NewLeaveRequestForm
            onSubmit={leaveRequestAddHandler}
            formik={formik}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            isLoading={isLoading}
            isError={isError}
            leaveType={leaveOptions}
          />
        </View>
      ) : null}
    </View>
  );
};

export default NewLeaveRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  history: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 20,
  },
  name: {
    width: 100,
    height: 30,
    fontSize: 12,
    fontWeight: "400",
    color: "#8A9099",
    textAlign: "center",
  },
});
