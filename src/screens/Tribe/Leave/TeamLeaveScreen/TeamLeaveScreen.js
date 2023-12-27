import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import TeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/TeamLeaveRequestList";

const TeamLeaveScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasBeenScrolledPending, setHasBeenScrolledPending] = useState(false);
  const [hasBeenScrolledApproved, setHasBeenScrolledApproved] = useState(false);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [reloadApproved, setReloadApproved] = useState(false);
  const [rejectedList, setRejectedList] = useState([]);
  const [reloadRejected, setReloadRejected] = useState(false);
  const [tabValue, setTabValue] = useState("waiting approval");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);

  const tabs = useMemo(() => {
    return [{ title: "waiting approval" }, { title: "approved" }, { title: "rejected" }];
  }, []);

  const navigation = useNavigation();

  const fetchMorePendingParameters = {
    page: currentPagePending,
    limit: 20,
    status: "Pending",
  };

  const fetchMoreApprovedParameters = {
    page: currentPageApproved,
    limit: 20,
    status: "Approved",
  };

  const fetchMoreRejectedParameters = {
    page: currentPage,
    limit: 20,
    status: "Rejected",
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
    isLoading: pendingLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "pending" && "/hr/leave-requests/personal"[(currentPagePending, reloadPending)],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
    isLoading: approvedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "approved" && "/hr/leave-requests/personal"[(currentPageApproved, reloadApproved)],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "rejected" && "/hr/leave-requests/personal"[(currentPage, reloadRejected)],
    fetchMoreRejectedParameters
  );

  const fetchMorePending = () => {
    if (currentPagePending < pendingLeaveRequest?.data?.last_page) {
      setCurrentPagePending(currentPagePending + 1);
    }
  };

  const fetchMoreApproved = () => {
    if (currentPageApproved < approvedLeaveRequest?.data?.last_page) {
      setCurrentPageApproved(currentPageApproved + 1);
    }
  };

  const fetchMoreRejected = () => {
    if (currentPage < rejectedLeaveRequest?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Submit response of leave request handler
   * @param {*} data
   * @param {*} setStatus
   * @param {*} setSubmitting
   */
  const approvalResponseHandler = async (data, setStatus, setSubmitting) => {
    try {
      const res = await axiosInstance.post(`/hr/approvals/approval`, data);
      setSubmitting(false);
      setStatus("success");
      refetchPendingLeaveRequest();
      refetchApprovedLeaveRequest();
      refetchRejectedLeaveRequest();
      Toast.show({
        type: "success",
        text1: data.status === "Approved" ? "Request Approved" : "Request Rejected",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setPendingList([]);
    setApprovedList([]);
    setRejectedList([]);
    setCurrentPagePending(1);
    setCurrentPageApproved(1);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  });

  useEffect(() => {
    if (pendingLeaveRequest?.data?.data?.length) {
      setPendingList((prevState) => [...prevState, ...pendingLeaveRequest?.data?.data]);
    }
  }, [pendingLeaveRequest?.data?.data?.length]);

  useEffect(() => {
    if (approvedLeaveRequest?.data?.data.length) {
      setApprovedList((prevData) => [...prevData, ...approvedLeaveRequest?.data?.data]);
    }
  }, [approvedLeaveRequest?.data?.data?.length]);

  useEffect(() => {
    if (rejectedLeaveRequest?.data?.data.length) {
      setRejectedList((prevData) => [...prevData, ...rejectedLeaveRequest?.data?.data]);
    }
  }, [rejectedLeaveRequest?.data?.data?.length]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isReady ? (
          <>
            <View style={styles.header}>
              <PageHeader width={200} title="My Team Leave Request" onPress={() => navigation.goBack()} />
            </View>

            <TeamLeaveRequestList
              pendingLeaveRequests={pendingList}
              approvedLeaveRequests={approvedList}
              rejectedLeaveRequests={rejectedList}
              pendingLeaveRequestIsFetching={pendingLeaveRequestIsFetching}
              approvedLeaveRequestIsFetching={approvedLeaveRequestIsFetching}
              rejectedLeaveRequestIsFetching={rejectedLeaveRequestIsFetching}
              refetchPendingLeaveRequest={refetchPendingLeaveRequest}
              refetchApprovedLeaveRequest={refetchApprovedLeaveRequest}
              refetchRejectedLeaveRequest={refetchRejectedLeaveRequest}
              hasBeenScrolled={hasBeenScrolled}
              setHasBeenScrolled={setHasBeenScrolled}
              hasBeenScrolledPending={hasBeenScrolledPending}
              setHasBeenScrolledPending={setHasBeenScrolledPending}
              hasBeenScrolledApproved={hasBeenScrolledApproved}
              setHasBeenScrolledApproved={setHasBeenScrolledApproved}
              fetchMorePending={fetchMorePending}
              fetchMoreApproved={fetchMoreApproved}
              fetchMoreRejected={fetchMoreRejected}
              pendingLeaveRequestIsLoading={pendingLeaveRequestIsLoading}
              approvedLeaveRequestIsLoading={approvedLeaveRequestIsLoading}
              rejectedLeaveRequestIsLoading={rejectedLeaveRequestIsLoading}
              onApproval={approvalResponseHandler}
              tabValue={tabValue}
              tabs={tabs}
              onChangeTab={onChangeTab}
            />
          </>
        ) : null}
      </SafeAreaView>
    </>
  );
};

export default TeamLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
