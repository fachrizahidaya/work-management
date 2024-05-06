import { memo, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";

import { StyleSheet, View } from "react-native";

import Tabs from "../../../shared/Tabs";
import MyTeamLeaveRequestList from "./MyTeamLeaveRequestList";

const MyTeamLeaveRequest = ({
  refetchTeamLeaveRequest,
  onApproval,
  pendingLeaveRequests,
  approvedLeaveRequests,
  rejectedLeaveRequests,
  pendingLeaveRequestIsFetching,
  approvedLeaveRequestIsFetching,
  rejectedLeaveRequestIsFetching,
  refetchPendingLeaveRequest,
  refetchApprovedLeaveRequest,
  refetchRejectedLeaveRequest,
  hasBeenScrolled,
  setHasBeenScrolled,
  hasBeenScrolledPending,
  setHasBeenScrolledPending,
  hasBeenScrolledApproved,
  setHasBeenScrolledApproved,
  fetchMorePending,
  fetchMoreApproved,
  fetchMoreRejected,
  pendingLeaveRequestIsLoading,
  approvedLeaveRequestIsLoading,
  rejectedLeaveRequestIsLoading,
  tabValue,
  tabs,
  onChangeTab,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(null);

  const firstTimeRef = useRef(null);

  /**
   * Aprroval or Rejection handler
   */
  const formik = useFormik({
    initialValues: {
      object: "",
      object_id: "",
      type: "",
      status: "",
      notes: "",
    },
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setStatus("processing");
      onApproval(values, setStatus, setSubmitting);
    },
  });

  /**
   * Response handler
   * @param {*} response
   */
  const responseHandler = (response, data) => {
    formik.setFieldValue("object", data?.approval_object);
    formik.setFieldValue("object_id", data?.approval_object_id);
    formik.setFieldValue("type", data?.approval_type);
    formik.setFieldValue("status", response);
    setIsSubmitting(response);
    formik.handleSubmit();
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      refetchTeamLeaveRequest();
    }
  }, [formik.isSubmitting && formik.status]);

  return (
    <>
      <View style={{ paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        {tabValue === "Pending" ? (
          <MyTeamLeaveRequestList
            data={pendingLeaveRequests}
            hasBeenScrolled={hasBeenScrolledPending}
            setHasBeenScrolled={setHasBeenScrolledPending}
            fetchMore={fetchMorePending}
            isFetching={pendingLeaveRequestIsFetching}
            refetch={refetchPendingLeaveRequest}
            refetchTeam={refetchTeamLeaveRequest}
            isLoading={pendingLeaveRequestIsLoading}
            formik={formik}
            isSubmitting={isSubmitting}
            responseHandler={responseHandler}
          />
        ) : tabValue === "Approved" ? (
          <MyTeamLeaveRequestList
            data={approvedLeaveRequests}
            hasBeenScrolled={hasBeenScrolledApproved}
            setHasBeenScrolled={setHasBeenScrolledApproved}
            fetchMore={fetchMoreApproved}
            isFetching={approvedLeaveRequestIsFetching}
            refetch={refetchApprovedLeaveRequest}
            refetchTeam={refetchTeamLeaveRequest}
            isLoading={approvedLeaveRequestIsLoading}
            formik={formik}
            isSubmitting={isSubmitting}
            responseHandler={responseHandler}
          />
        ) : (
          <MyTeamLeaveRequestList
            data={rejectedLeaveRequests}
            hasBeenScrolled={hasBeenScrolled}
            setHasBeenScrolled={setHasBeenScrolled}
            fetchMore={fetchMoreRejected}
            isFetching={rejectedLeaveRequestIsFetching}
            refetch={refetchRejectedLeaveRequest}
            refetchTeam={refetchTeamLeaveRequest}
            isLoading={rejectedLeaveRequestIsLoading}
            formik={formik}
            isSubmitting={isSubmitting}
            responseHandler={responseHandler}
          />
        )}
      </View>
    </>
  );
};

export default memo(MyTeamLeaveRequest);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 14,
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
