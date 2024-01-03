import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import MyTeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/MyTeamLeaveRequestList";

const MyTeamLeaveScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasBeenScrolledPending, setHasBeenScrolledPending] = useState(false);
  const [hasBeenScrolledApproved, setHasBeenScrolledApproved] = useState(false);
  const [hasBeenScrolledRejected, setHasBeenScrolledRejected] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [reloadApproved, setReloadApproved] = useState(false);
  const [rejectedList, setRejectedList] = useState([]);
  const [reloadRejected, setReloadRejected] = useState(false);
  const [tabValue, setTabValue] = useState("waiting approval");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageRejected, setCurrentPageRejected] = useState(1);

  const tabs = useMemo(() => {
    return [
      { title: "waiting approval", value: "waiting approval" },
      { title: "approved", value: "approved" },
      { title: "rejected", value: "rejected" },
    ];
  }, []);

  const navigation = useNavigation();

  const fetchMorePendingParameters = {
    page: currentPagePending,
    limit: 10,
    status: "Pending",
  };

  const fetchMoreApprovedParameters = {
    page: currentPageApproved,
    limit: 10,
    status: "Approved",
  };

  const fetchMoreRejectedParameters = {
    page: currentPageRejected,
    limit: 10,
    status: "Rejected",
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
    isLoading: pendingLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "waiting approval" && "/hr/leave-requests/waiting-approval",
    [currentPagePending, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
    isLoading: approvedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "approved" && "/hr/leave-requests/waiting-approval",
    [currentPageApproved, reloadApproved],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "rejected" && "/hr/leave-requests/waiting-approval",
    [currentPageRejected, reloadRejected],
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
    if (currentPageRejected < rejectedLeaveRequest?.data?.last_page) {
      setCurrentPageRejected(currentPageRejected + 1);
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
    setCurrentPageRejected(1);
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

            <MyTeamLeaveRequestList
              pendingLeaveRequests={pendingList}
              approvedLeaveRequests={approvedList}
              rejectedLeaveRequests={rejectedList}
              pendingLeaveRequestIsFetching={pendingLeaveRequestIsFetching}
              approvedLeaveRequestIsFetching={approvedLeaveRequestIsFetching}
              rejectedLeaveRequestIsFetching={rejectedLeaveRequestIsFetching}
              refetchPendingLeaveRequest={refetchPendingLeaveRequest}
              refetchApprovedLeaveRequest={refetchApprovedLeaveRequest}
              refetchRejectedLeaveRequest={refetchRejectedLeaveRequest}
              hasBeenScrolled={hasBeenScrolledRejected}
              setHasBeenScrolled={setHasBeenScrolledRejected}
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

export default MyTeamLeaveScreen;

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