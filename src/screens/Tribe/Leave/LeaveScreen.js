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
  const [forceRerender, setForceRerender] = useState(false);
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
  const [searchInput, setSearchInput] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);

  const approvalLeaveRequestCheckAccess = useCheckAccess("approval", "Leave Requests");

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [
      { title: "pending", number: pendingCount },
      { title: "approved", number: approvedCount },
      { title: "rejected", number: rejectedCount },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const fetchMorePendingParameters = {
    page: currentPagePending,
    search: searchInput,
    limit: 10,
    status: "Pending",
  };

  const fetchMoreApprovedParameters = {
    page: currentPageApproved,
    search: searchInput,
    limit: 10,
    status: "Approved",
  };

  const fetchMoreRejectedParameters = {
    page: currentPage,
    search: searchInput,
    limit: 10,
    status: "Rejected",
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
  } = useFetch(
    tabValue === "pending" && "/hr/leave-requests/personal",
    [currentPagePending, searchInput, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
  } = useFetch(
    tabValue === "approved" && "/hr/leave-requests/personal",
    [currentPageApproved, searchInput, reloadApproved],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "rejected" && "/hr/leave-requests/personal",
    [currentPage, searchInput, reloadRejected],
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

  /**
   * Filtered leave handler
   */
  const pendingLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Pending");
  const pendingCount = pendingLeaveRequests.length;
  const approvedLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Approved");
  const approvedCount = approvedLeaveRequests.length;
  const rejectedLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Rejected");
  const rejectedCount = rejectedLeaveRequests.length;

  useEffect(() => {
    if (pendingLeaveRequest?.data?.data.length) {
      if (!searchInput) {
        setPendingList((prevData) => [...prevData, pendingLeaveRequest?.data?.data]);
        setFilteredArray([]);
      } else {
        setFilteredArray((prevData) => [...prevData, pendingLeaveRequest?.data?.data]);
        setPendingList([]);
      }
    }
  }, [pendingLeaveRequest]);

  useEffect(() => {
    if (approvedLeaveRequest?.data?.data.length) {
      if (!searchInput) {
        setApprovedList((prevData) => [...prevData, approvedLeaveRequest?.data?.data]);
        setFilteredArray([]);
      } else {
        setFilteredArray((prevData) => [...prevData, ...approvedLeaveRequest?.data?.data]);
        setApprovedList([]);
      }
    }
  }, [approvedLeaveRequest]);

  useEffect(() => {
    if (rejectedLeaveRequest?.data?.data.length) {
      if (!searchInput) {
        setRejectedList((prevData) => [...prevData, ...rejectedLeaveRequest?.data?.data]);
        setFilteredArray([]);
      } else {
        setFilteredArray((prevData) => [...prevData, ...rejectedLeaveRequest?.data?.data]);
        setRejectedList([]);
      }
    }
  }, [rejectedLeaveRequest]);

  useEffect(() => {
    return () => {
      setTabValue("pending");
    };
  }, [personalLeaveRequest]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
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
            forceRerender={forceRerender}
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
});
