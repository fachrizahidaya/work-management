import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Button from "../../../../components/shared/Forms/Button";
import { useFetch } from "../../../../hooks/useFetch";
import useCheckAccess from "../../../../hooks/useCheckAccess";
import ConfirmationModal from "../../../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import LeaveRequestList from "../../../../components/Tribe/Leave/PersonalLeaveRequest/LeaveRequestList";
import { SheetManager } from "react-native-actions-sheet";
import Select from "../../../../components/shared/Forms/Select";

const PersonalLeaveScreen = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [hasBeenScrolledPending, setHasBeenScrolledPending] = useState(false);
  const [hasBeenScrolledApproved, setHasBeenScrolledApproved] = useState(false);
  const [hasBeenScrolledRejected, setHasBeenScrolledRejected] = useState(false);
  const [hasBeenScrolledCanceled, setHasBeenScrolledCanceled] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [reloadApproved, setReloadApproved] = useState(false);
  const [rejectedList, setRejectedList] = useState([]);
  const [reloadRejected, setReloadRejected] = useState(false);
  const [canceledList, setCanceledList] = useState([]);
  const [reloadCanceled, setReloadCanceled] = useState(false);
  const [tabValue, setTabValue] = useState("Pending");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageRejected, setCurrentPageRejected] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageCanceled, setCurrentPageCanceled] = useState(1);
  const [filterYear, setFilterYear] = useState(dayjs().format("YYYY"));
  const [filterType, setFilterType] = useState("personal");

  const approvalLeaveRequestCheckAccess = useCheckAccess("approval", "Leave Requests");

  const cancleScreenSheetRef = useRef(null);

  const navigation = useNavigation();

  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

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

  const fetchMoreCanceledParameters = {
    page: currentPageCanceled,
    limit: 10,
    status: tabValue,
  };

  const {
    data: pendingLeaveRequest,
    refetch: refetchPendingLeaveRequest,
    isFetching: pendingLeaveRequestIsFetching,
    isLoading: pendingLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Pending" && "/hr/leave-requests/personal",
    [currentPagePending, reloadPending],
    fetchMorePendingParameters
  );

  const {
    data: approvedLeaveRequest,
    refetch: refetchApprovedLeaveRequest,
    isFetching: approvedLeaveRequestIsFetching,
    isLoading: approvedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Approved" && "/hr/leave-requests/personal",
    [currentPageApproved, reloadApproved],
    fetchMoreApprovedParameters
  );

  const {
    data: rejectedLeaveRequest,
    refetch: refetchRejectedLeaveRequest,
    isFetching: rejectedLeaveRequestIsFetching,
    isLoading: rejectedLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Rejected" && "/hr/leave-requests/personal",
    [currentPageRejected, reloadRejected],
    fetchMoreRejectedParameters
  );

  const {
    data: canceledLeaveRequest,
    refetch: refetchCanceledLeaveRequest,
    isFetching: canceledLeaveRequestIsFetching,
    isLoading: canceledLeaveRequestIsLoading,
  } = useFetch(
    tabValue === "Canceled" && "/hr/leave-requests/personal",
    [currentPageCanceled, reloadCanceled],
    fetchMoreCanceledParameters
  );

  const { data: personalLeaveRequest, refetch: refetchPersonalLeaveRequest } = useFetch("/hr/leave-requests/personal");

  const { data: teamLeaveRequestData } = useFetch("/hr/leave-requests/waiting-approval");

  /**
   * Handle total of leave status
   */
  const pending =
    personalLeaveRequest?.data?.filter((item) => {
      return item?.status === "Pending";
    }) || [];
  const approved =
    personalLeaveRequest?.data?.filter((item) => {
      return item?.status === "Approved";
    }) || [];
  const rejected =
    personalLeaveRequest?.data?.filter((item) => {
      return item?.status === "Rejected";
    }) || [];
  const canceled =
    personalLeaveRequest?.data?.filter((item) => {
      return item?.status === "Canceled";
    }) || [];

  const tabs = useMemo(() => {
    return [
      { title: `Pending (${pending?.length})`, value: "Pending" },
      { title: `Canceled (${canceled?.length})`, value: "Canceled" },
      { title: `Rejected (${rejected?.length})`, value: "Rejected" },
      { title: `Approved (${approved?.length})`, value: "Approved" },
    ];
  }, [personalLeaveRequest, pending, canceled, rejected, approved]);

  /**
   * Handle fetch more leave by status
   */
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
  const fetchMoreCanceled = () => {
    if (currentPageCanceled < canceledLeaveRequest?.data?.last_page) {
      setCurrentPageCanceled(currentPageCanceled + 1);
      setReloadCanceled(!reloadCanceled);
    }
  };

  /**
   * Handle selected leave to cancel
   * @param {*} leave
   */
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
    setCanceledList([]);
    setCurrentPagePending(1);
    setCurrentPageApproved(1);
    setCurrentPageRejected(1);
    setCurrentPageCanceled(1);
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

  useEffect(() => {
    if (canceledLeaveRequest?.data?.data?.length) {
      setCanceledList((prevData) => [...prevData, ...canceledLeaveRequest?.data?.data]);
    }
  }, [canceledLeaveRequest?.data?.data?.length]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>My Leave Request</Text>
          </View>

          {/* <Pressable
            style={{ padding: 5, borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB" }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View
                      style={{
                        display: "flex",
                        gap: 21,
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        paddingBottom: 40,
                      }}
                    >
                      <Select
                        value={filterYear}
                        placeHolder={filterYear ? filterYear : "Select Year"}
                        items={[
                          { value: 2024, label: 2024 },
                          { value: 2023, label: 2023 },
                        ]}
                        onChange={(value) => setFilterYear(value)}
                        hasParentSheet
                      />
                      <Select
                        value={filterType}
                        placeHolder={filterType ? filterType : "Select Type"}
                        items={[
                          { value: "personal", label: "Personal" },
                          { value: "team", label: "Team" },
                        ]}
                        onChange={(value) => setFilterType(value)}
                        hasParentSheet
                      />
                    </View>
                  ),
                },
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
            </View>
          </Pressable> */}

          {teamLeaveRequestData?.data.length > 0 && approvalLeaveRequestCheckAccess && (
            <Button
              height={35}
              onPress={() => navigation.navigate("Team Leave Request")}
              padding={5}
              children={
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "#FFFFFF",
                  }}
                >
                  {" "}
                  My Team
                </Text>
              }
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
            canceledList={canceledList}
            pendingLeaveRequestIsFetching={pendingLeaveRequestIsFetching}
            approvedLeaveRequestIsFetching={approvedLeaveRequestIsFetching}
            rejectedLeaveRequestIsFetching={rejectedLeaveRequestIsFetching}
            canceledLeaveRequestIsFetching={canceledLeaveRequestIsFetching}
            pendingLeaveRequestIsLoading={pendingLeaveRequestIsLoading}
            approvedLeaveRequestIsLoading={approvedLeaveRequestIsLoading}
            rejectedLeaveRequestIsLoading={rejectedLeaveRequestIsLoading}
            canceledLeaveRequestIsLoading={canceledLeaveRequestIsLoading}
            refetchPendingLeaveRequest={refetchPendingLeaveRequest}
            refetchApprovedLeaveRequest={refetchApprovedLeaveRequest}
            refetchRejectedLeaveRequest={refetchRejectedLeaveRequest}
            refetchCanceledLeaveRequest={refetchCanceledLeaveRequest}
            hasBeenScrolled={hasBeenScrolledRejected}
            setHasBeenScrolled={setHasBeenScrolledRejected}
            hasBeenScrolledPending={hasBeenScrolledPending}
            setHasBeenScrolledPending={setHasBeenScrolledPending}
            hasBeenScrolledApproved={hasBeenScrolledApproved}
            setHasBeenScrolledApproved={setHasBeenScrolledApproved}
            hasBeenScrolledCanceled={hasBeenScrolledCanceled}
            setHasBeenScrolledCanceled={setHasBeenScrolledCanceled}
            fetchMorePending={fetchMorePending}
            fetchMoreApproved={fetchMoreApproved}
            fetchMoreRejected={fetchMoreRejected}
            fetchMoreCanceled={fetchMoreCanceled}
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabs={tabs}
            onChangeTab={onChangeTab}
            refetchPersonalLeaveRequest={refetchPersonalLeaveRequest}
            teamLeaveRequestData={teamLeaveRequestData?.data.length}
            checkAccess={approvalLeaveRequestCheckAccess}
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
          refetchPersonalLeaveRequest();
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
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
