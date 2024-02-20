import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import MyTeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/MyTeamLeaveRequestList";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import SuccessModal from "../../../../components/shared/Modal/SuccessModal";

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
  const [tabValue, setTabValue] = useState("Pending");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageRejected, setCurrentPageRejected] = useState(1);

  const navigation = useNavigation();

  const fetchMorePendingParameters = {
    page: currentPagePending,
    limit: 100,
    status: tabValue,
  };

  const fetchMoreApprovedParameters = {
    page: currentPageApproved,
    limit: 10,
    status: tabValue,
  };

  const fetchMoreRejectedParameters = {
    page: currentPageRejected,
    limit: 10,
    status: tabValue,
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
    isLoading: pendingLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Pending" && "/hr/leave-requests/my-team",
    [currentPagePending, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
    isLoading: approvedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Approved" && "/hr/leave-requests/my-team",
    [currentPageApproved, reloadApproved],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Rejected" && "/hr/leave-requests/my-team",
    [currentPageRejected, reloadRejected],
    fetchMoreRejectedParameters
  );

  const { data: teamLeaveRequest, refetch: refetchTeamLeaveRequest } = useFetch("/hr/leave-requests/my-team");

  const {isOpen: approvalModalIsOpen, toggle: toggleApprovalModal} = useDisclosure(false)
  const {isOpen: rejectionModalIsOpen, toggle: toggleRejectionModal} = useDisclosure(false)

  const pending =
    teamLeaveRequest?.data?.filter((item) => {
      return item.status === "Pending";
    }) || [];
  const approved =
    teamLeaveRequest?.data?.filter((item) => {
      return item.status === "Approved";
    }) || [];
  const rejected =
    teamLeaveRequest?.data?.filter((item) => {
      return item.status === "Rejected";
    }) || [];

  const tabs = useMemo(() => {
    return [
      { title: `Waiting Approval (${pending?.length})`, value: "Pending" },
      { title: `Approved (${approved?.length})`, value: "Approved" },
      { title: `Rejected (${rejected?.length})`, value: "Rejected" },
    ];
  }, [teamLeaveRequest, pending, approved, rejected]);

  const fetchMorePending = () => {
    if (currentPagePending < pendingLeaveRequest?.data?.last_page) {
      setCurrentPagePending(currentPagePending + 1);
      setReloadPending(!reloadPending);
    }
  };

  const fetchMoreApproved = () => {
    if (currentPageApproved < approvedLeaveRequest?.data?.last_page) {
      setCurrentPageApproved(currentPageApproved + 1);
      setReloadApproved(!reloadApproved);
    }
  };

  const fetchMoreRejected = () => {
    if (currentPageRejected < rejectedLeaveRequest?.data?.last_page) {
      setCurrentPageRejected(currentPageRejected + 1);
      setReloadRejected(!reloadRejected);
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
      refetchTeamLeaveRequest();
      if (data.status === 'Approved') {
        toggleApprovalModal()
      } else {
        toggleRejectionModal()
      }
      // Toast.show(data.status === "Approved" ? "Request Approved" : "Request Rejected", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
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
    if (pendingLeaveRequest?.data?.data.length >= 0) {
      setPendingList(() => [...pendingLeaveRequest?.data?.data]);
    }
  }, [pendingLeaveRequest?.data?.data.length]);

  useEffect(() => {
    if (approvedLeaveRequest?.data?.data?.length) {
      setApprovedList((prevData) => [...prevData, ...approvedLeaveRequest?.data?.data]);
    }
  }, [approvedLeaveRequest?.data?.data?.length]);

  useEffect(() => {
    if (rejectedLeaveRequest?.data?.data?.length) {
      setRejectedList((prevData) => [...prevData, ...rejectedLeaveRequest?.data?.data]);
    }
  }, [rejectedLeaveRequest?.data?.data?.length]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isReady ? (
          <>
            <View style={styles.header}>
              <PageHeader title="My Team Leave Request" onPress={() => navigation.goBack()} />
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
              refetchTeamLeaveRequest={refetchTeamLeaveRequest}
            />
          </>
        ) : null}
      </SafeAreaView>
      <SuccessModal isOpen={approvalModalIsOpen} toggle={toggleApprovalModal} topElement={
        <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "#46D590", fontSize: 16, fontWeight: "500" }}>Approval </Text>
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>confirmed!</Text>
      </View>
      } bottomElement={
        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>Thank you for your prompt action</Text>

      } />
      <SuccessModal isOpen={rejectionModalIsOpen} toggle={toggleRejectionModal} topElement={
        <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "#FF7272", fontSize: 16, fontWeight: "500" }}>Decline </Text>
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>with thanks!</Text>
      </View>
      } bottomElement={
        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>Requester will be notified of the decline</Text>

      } />
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
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
