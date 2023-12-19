import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Image, Skeleton, Text, VStack } from "native-base";

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

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [{ title: "pending" }, { title: "approved" }, { title: "rejected" }];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setPendingList([]);
    setApprovedList([]);
    setRejectedList([]);
    setCurrentPagePending(1);
    setCurrentPageApproved(1);
    setCurrentPage(1);
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
  } = useFetch(
    tabValue === "pending" && "/hr/leave-requests/personal",
    [currentPagePending, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
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

  const {
    data: personalLeaveRequest,
    refetch: refetchPersonalLeaveRequest,
    isFetching: personalLeaveRequestIsFetching,
    isLoading: personalLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/personal");

  const { data: profile, refetch: refetchProfile } = useFetch("/hr/my-profile");

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
    toggleAction();
  };

  const closeSelectedLeaveHandler = () => {
    setSelectedData(null);
    toggleAction();
  };

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
        <Flex style={styles.header} py={14} px={15}>
          <PageHeader title="My Leave Request" backButton={false} />

          {teamLeaveRequestData?.data.length > 0 && approvalLeaveRequestCheckAccess && (
            <Button onPress={() => navigation.navigate("Team Leave Request")} size="sm">
              My Team
            </Button>
          )}
        </Flex>

        <>
          {/* Content here */}
          <LeaveRequestList
            refetchProfile={refetchProfile}
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
            rejectedLeaveRequestIsLoading={rejectedLeaveRequestIsLoading}
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabs={tabs}
            onChangeTab={onChangeTab}
          />
        </>
      </SafeAreaView>
      <CancelAction
        actionIsOpen={actionIsOpen}
        onDeselect={closeSelectedLeaveHandler}
        toggleCancelModal={toggleCancelModal}
      />
      <ConfirmationModal
        isOpen={cancelModalIsOpen}
        toggle={toggleCancelModal}
        apiUrl={`/hr/leave-requests/${selectedData?.id}/cancel`}
        hasSuccessFunc={true}
        header="Cancel Leave Request"
        onSuccess={() => {
          toggleAction();
          refetchPersonalLeaveRequest();
          refetchProfile();
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
  },
});
