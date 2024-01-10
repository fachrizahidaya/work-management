import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View, Text } from "react-native";

import Button from "../../../../components/shared/Forms/Button";
import { useFetch } from "../../../../hooks/useFetch";
import useCheckAccess from "../../../../hooks/useCheckAccess";
import ConfirmationModal from "../../../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import LeaveRequestList from "../../../../components/Tribe/Leave/PersonalLeaveRequest/LeaveRequestList";

const PersonalLeaveScreen = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [hasBeenScrolledPending, setHasBeenScrolledPending] = useState(false);
  const [hasBeenScrolledApproved, setHasBeenScrolledApproved] = useState(false);
  const [hasBeenScrolledRejected, setHasBeenScrolledRejected] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [reloadApproved, setReloadApproved] = useState(false);
  const [rejectedList, setRejectedList] = useState([]);
  const [reloadRejected, setReloadRejected] = useState(false);
  const [canceledList, setCanceledList] = useState([]);
  const [reloadCanceled, setReloadCanceled] = useState(false);
  const [tabValue, setTabValue] = useState("pending");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageRejected, setCurrentPageRejected] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageCanceled, setCurrentPageCanceled] = useState(1);

  const approvalLeaveRequestCheckAccess = useCheckAccess("approval", "Leave Requests");

  const cancleScreenSheetRef = useRef(null);

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [
      { title: "pending", value: "pending" },
      { title: "canceled", value: "canceled" },
      { title: "rejected", value: "rejected" },
      { title: "approved", value: "approved" },
    ];
  }, []);

  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const fetchMorePendingParameters = {
    page: currentPagePending,
    limit: 100,
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

  const fetchMoreCanceledParameters = {
    page: currentPageRejected,
    limit: 10,
    status: "Canceled",
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
    isLoading: pendingLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "pending" && "/hr/leave-requests/personal",
    [currentPagePending, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
    isLoading: approvedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "approved" && "/hr/leave-requests/personal",
    [currentPageApproved, reloadApproved],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "rejected" && "/hr/leave-requests/personal",
    [currentPageRejected, reloadRejected],
    fetchMoreRejectedParameters
  );

  const {
    data: canceledLeaveRequest,
    refetch: refetchCanceledLeaveRequest,
    isFetching: canceledLeaveRequestIsFetching,
    isLoading: canceledLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "rejected" && "/hr/leave-requests/personal",
    [currentPageRejected, reloadRejected],
    fetchMoreRejectedParameters
  );

  const { data: teamLeaveRequestData } = useFetch("/hr/leave-requests/waiting-approval");

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

  const openSelectedLeaveHandler = (leave) => {
    setSelectedData(leave);
    toggleCancelModal();
  };

  const closeSelectedLeaveHandler = () => {
    setSelectedData(null);
    cancleScreenSheetRef.current?.hide();
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
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>My Leave Request</Text>
          </View>

          {teamLeaveRequestData?.data.length > 0 && approvalLeaveRequestCheckAccess && (
            <Button
              height={35}
              onPress={() => navigation.navigate("Team Leave Request")}
              padding={5}
              children={<Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}> My Team</Text>}
            />
          )}
        </View>

        <>
          {/* Content here */}
          <LeaveRequestList
            onSelect={openSelectedLeaveHandler}
            onDeselect={closeSelectedLeaveHandler}
            pendingList={pendingList}
            approvedList={approvedList}
            rejectedList={rejectedList}
            pendingLeaveRequestIsFetching={pendingLeaveRequestIsFetching}
            approvedLeaveRequestIsFetching={approvedLeaveRequestIsFetching}
            rejectedLeaveRequestIsFetching={rejectedLeaveRequestIsFetching}
            pendingLeaveRequestIsLoading={pendingLeaveRequestIsLoading}
            approvedLeaveRequestIsLoading={approvedLeaveRequestIsLoading}
            rejectedLeaveRequestIsLoading={rejectedLeaveRequestIsLoading}
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
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabs={tabs}
            onChangeTab={onChangeTab}
          />
        </>
      </SafeAreaView>

      <ConfirmationModal
        isOpen={cancelModalIsOpen}
        toggle={toggleCancelModal}
        apiUrl={`/hr/leave-requests/${selectedData?.id}/cancel`}
        header="Cancel Leave Request"
        hasSuccessFunc={true}
        onSuccess={() => {
          refetchPendingLeaveRequest();
          cancleScreenSheetRef.current?.hide();
        }}
        description="Are you sure to cancel this request?"
        successMessage="Request canceled"
        isDelete={false}
        isPatch={true}
      />
    </>
  );
};

export default PersonalLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
