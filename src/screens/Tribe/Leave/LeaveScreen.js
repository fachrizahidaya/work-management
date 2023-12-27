import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View, Text } from "react-native";

import Button from "../../../components/shared/Forms/Button";
import { useFetch } from "../../../hooks/useFetch";
import PageHeader from "../../../components/shared/PageHeader";
import useCheckAccess from "../../../hooks/useCheckAccess";
import { useDisclosure } from "../../../hooks/useDisclosure";
import LeaveRequestList from "../../../components/Tribe/Leave/LeaveRequestList";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import CancelAction from "../../../components/Tribe/Leave/CancelAction";

const LeaveScreen = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [hasBeenScrolledPending, setHasBeenScrolledPending] = useState(false);
  const [hasBeenScrolledApproved, setHasBeenScrolledApproved] = useState(false);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [reloadApproved, setReloadApproved] = useState(false);
  const [rejectedList, setRejectedList] = useState([]);
  const [reloadRejected, setReloadRejected] = useState(false);
  const [tabValue, setTabValue] = useState("pending");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);

  const approvalLeaveRequestCheckAccess = useCheckAccess("approval", "Leave Requests");

  const cancleScreenSheetRef = useRef(null);

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [{ title: "pending" }, { title: "approved" }, { title: "rejected" }];
  }, []);

  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

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
    [currentPage, reloadRejected],
    fetchMoreRejectedParameters
  );

  const { data: teamLeaveRequestData } = useFetch("/hr/leave-requests/waiting-approval");

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

  const openSelectedLeaveHandler = (leave) => {
    setSelectedData(leave);
    // toggleAction();
    cancleScreenSheetRef.current?.show();
  };

  const closeSelectedLeaveHandler = () => {
    setSelectedData(null);
    // toggleAction();
    cancleScreenSheetRef.current?.hide();
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
        <View style={styles.header}>
          <PageHeader title="My Leave Request" backButton={false} />

          {teamLeaveRequestData?.data.length > 0 && approvalLeaveRequestCheckAccess && (
            <Button
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
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabs={tabs}
            onChangeTab={onChangeTab}
          />
        </>
      </SafeAreaView>
      <CancelAction
        onDeselect={closeSelectedLeaveHandler}
        toggleCancelModal={toggleCancelModal}
        reference={cancleScreenSheetRef}
      />
      <ConfirmationModal
        isOpen={cancelModalIsOpen}
        toggle={toggleCancelModal}
        apiUrl={`/hr/leave-requests/${selectedData?.id}/cancel`}
        hasSuccessFunc={true}
        header="Cancel Leave Request"
        onSuccess={() => {
          cancleScreenSheetRef.current?.hide();
          refetchPendingLeaveRequest;
        }}
        description="Are you sure to cancel this request?"
        successMessage="Request canceled"
        isDelete={false}
        isPatch={true}
      />
    </>
  );
};

export default LeaveScreen;

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
