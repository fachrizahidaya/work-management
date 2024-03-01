import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import _ from "lodash";

import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../../components/shared/PageHeader";
import axiosInstance from "../../../../config/api";
import { useFetch } from "../../../../hooks/useFetch";
import NewLeaveRequestForm from "../../../../components/Tribe/Leave/NewLeaveRequest/NewLeaveRequestForm";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";

const NewLeaveRequest = () => {
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formError, setFormError] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [filteredType, setFilteredType] = useState([]);

  const navigation = useNavigation();

  const route = useRoute();

  const { width, height } = Dimensions.get("window");

  const selectLeaveTypeScreenSheetRef = useRef(null);

  const { employeeId, isOpen, toggle } = route.params;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const fetchLeaveTypeParameters = {
    search: searchInput,
  };

  const {
    data: leaveHistory,
    refetch: refetchLeaveHistory,
    isFetching: leaveHistoryIsFetching,
  } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);

  const {
    data: leaveType,
    isFetching: leaveTypeIsFetching,
    refetch: refetchLeaveType,
  } = useFetch("/hr/leaves", [searchInput], fetchLeaveTypeParameters);

  if (filteredType.length > 0) {
    var leaveOptionsFiltered = filteredType?.map((item) => ({
      value: item.id,
      label: item.name,
      active: item.active,
      days: item.days,
      generate_type: item.generate_type,
    }));
  } else {
    var leaveOptionsUnfiltered = leaveTypes?.map((item) => ({
      value: item.id,
      label: item.name,
      active: item.active,
      days: item.days,
      generate_type: item.generate_type,
    }));
  }

  /**
   * Handle Search leave type
   */
  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 300),
    []
  );

  /**
   * Handle calculate available leave quota and day-off
   */
  const filterAvailableLeaveHistory = () => {
    let availableLeave = [];
    leaveHistory?.data.map((item) => {
      if (item?.active) {
        const index = availableLeave.findIndex((leave) => leave?.leave_name === item?.name); // Fix: use item?.name instead of leaveHistory?.name
        if (availableLeave.length > 0 && index > -1) {
          availableLeave[index].quota += item?.quota;
        } else {
          availableLeave.push({
            leave_name: item?.leave_name,
            quota: item?.quota,
          });
        }
      }
    });

    if (availableLeave.length > 0) {
      setAvailableLeaves(availableLeave);
    }
  };

  /**
   * Handle begin and end date Leave
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

  /**
   * Handle submit leave request
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
      toggle();
      // Toast.show("Request created", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle calculate leave quota
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
   * Handle create leave request
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

  useEffect(() => {
    setFilteredType([]);
  }, [searchInput]);

  useEffect(() => {
    if (leaveType?.data.length) {
      if (!searchInput) {
        setLeaveTypes((prevData) => [...prevData, ...leaveType?.data]);
        setFilteredType([]);
      } else {
        setFilteredType((prevData) => [...prevData, ...leaveType?.data]);
        setLeaveTypes([]);
      }
    }
  }, [leaveType]);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              ) : !availableLeaves ? (
                <Text style={{ fontSize: 14, fontWeight: "400" }}>You don't have any leave quota</Text>
              ) : (
                availableLeaves?.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
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
              leaveType={filteredType.length > 0 ? leaveOptionsFiltered : leaveOptionsUnfiltered}
              reference={selectLeaveTypeScreenSheetRef}
              handleSearch={handleSearch}
              inputToShow={inputToShow}
              setInputToShow={setInputToShow}
              setSearchInput={setSearchInput}
            />
          </View>
        ) : null}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default NewLeaveRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  history: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 17,
    marginTop: 22,
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
