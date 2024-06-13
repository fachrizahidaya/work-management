import { memo } from "react";

import { StyleSheet, View } from "react-native";

import Tabs from "../../../shared/Tabs";
import LeaveRequestList from "./LeaveRequestList";

const PersonalLeaveRequest = ({
  onSelect,
  pendingList,
  approvedList,
  rejectedList,
  canceledList,
  pendingLeaveRequestIsFetching,
  approvedLeaveRequestIsFetching,
  rejectedLeaveRequestIsFetching,
  canceledLeaveRequestIsFetching,
  pendingLeaveRequestIsLoading,
  approvedLeaveRequestIsLoading,
  rejectedLeaveRequestIsLoading,
  canceledLeaveRequestIsLoading,
  refetchPendingLeaveRequest,
  refetchApprovedLeaveRequest,
  refetchRejectedLeaveRequest,
  refetchCanceledLeaveRequest,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMorePending,
  fetchMoreApproved,
  fetchMoreRejected,
  fetchMoreCanceled,
  tabValue,
  tabs,
  onChangeTab,
  hasBeenScrolledPending,
  setHasBeenScrolledPending,
  hasBeenScrolledApproved,
  setHasBeenScrolledApproved,
  hasBeenScrolledCanceled,
  setHasBeenScrolledCanceled,
  refetchPersonalLeaveRequest,
  teamLeaveRequestData,
  renderSkeletons,
}) => {
  return (
    <>
      <View style={{ paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        {tabValue === "Pending" ? (
          <LeaveRequestList
            data={pendingList}
            teamLeaveRequestData={teamLeaveRequestData}
            hasBeenScrolled={hasBeenScrolledPending}
            setHasBeenScrolled={setHasBeenScrolledPending}
            fetchMore={fetchMorePending}
            isFetching={pendingLeaveRequestIsFetching}
            refetch={refetchPendingLeaveRequest}
            refetchPersonal={refetchPersonalLeaveRequest}
            isLoading={pendingLeaveRequestIsLoading}
            onSelect={onSelect}
            renderSkeletons={renderSkeletons}
          />
        ) : tabValue === "Approved" ? (
          <LeaveRequestList
            data={approvedList}
            teamLeaveRequestData={teamLeaveRequestData}
            hasBeenScrolled={hasBeenScrolledApproved}
            setHasBeenScrolled={setHasBeenScrolledApproved}
            fetchMore={fetchMoreApproved}
            isFetching={approvedLeaveRequestIsFetching}
            refetch={refetchApprovedLeaveRequest}
            refetchPersonal={refetchPersonalLeaveRequest}
            isLoading={approvedLeaveRequestIsLoading}
            renderSkeletons={renderSkeletons}
          />
        ) : tabValue === "Canceled" ? (
          <LeaveRequestList
            data={canceledList}
            teamLeaveRequestData={teamLeaveRequestData}
            hasBeenScrolled={hasBeenScrolledCanceled}
            setHasBeenScrolled={setHasBeenScrolledCanceled}
            fetchMore={fetchMoreCanceled}
            isFetching={canceledLeaveRequestIsFetching}
            refetch={refetchCanceledLeaveRequest}
            refetchPersonal={refetchPersonalLeaveRequest}
            isLoading={canceledLeaveRequestIsLoading}
            renderSkeletons={renderSkeletons}
          />
        ) : (
          <LeaveRequestList
            data={rejectedList}
            teamLeaveRequestData={teamLeaveRequestData}
            hasBeenScrolled={hasBeenScrolled}
            setHasBeenScrolled={setHasBeenScrolled}
            fetchMore={fetchMoreRejected}
            isFetching={rejectedLeaveRequestIsFetching}
            refetch={refetchRejectedLeaveRequest}
            refetchPersonal={refetchPersonalLeaveRequest}
            isLoading={rejectedLeaveRequestIsLoading}
            renderSkeletons={renderSkeletons}
          />
        )}
      </View>
    </>
  );
};

export default memo(PersonalLeaveRequest);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
  },
});
