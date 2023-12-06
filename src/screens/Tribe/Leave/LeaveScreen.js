import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Image, Skeleton, Text, VStack } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../../hooks/useFetch";
import PageHeader from "../../../components/shared/PageHeader";
import useCheckAccess from "../../../hooks/useCheckAccess";
import { useDisclosure } from "../../../hooks/useDisclosure";
import Tabs from "../../../components/shared/Tabs";
import LeaveRequestList from "../../../components/Tribe/Leave/LeaveRequestList";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import { useMemo } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import CancelAction from "../../../components/Tribe/Leave/CancelAction";

const LeaveScreen = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [tabValue, setTabValue] = useState("pending");
  const approvalLeaveRequestCheckAccess = useCheckAccess("approval", "Leave Requests");

  const navigation = useNavigation();

  const tabs = useMemo(() => {
    return [{ title: "pending" }, { title: "approved" }, { title: "rejected" }];
  }, []);

  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const {
    data: personalLeaveRequest,
    refetch: refetchPersonalLeaveRequest,
    isFetching: personalLeaveRequestIsFetching,
    isLoading: personalLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/personal");

  const { data: profile, refetch: refetchProfile } = useFetch("/hr/my-profile");

  const { data: teamLeaveRequestData } = useFetch("/hr/leave-requests/waiting-approval");

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

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

        {!personalLeaveRequestIsLoading ? (
          personalLeaveRequest?.data.length > 0 ? (
            <>
              {/* Content here */}
              <LeaveRequestList
                pendingLeaveRequests={pendingLeaveRequests}
                approvedLeaveRequests={approvedLeaveRequests}
                rejectedLeaveRequests={rejectedLeaveRequests}
                refetchPersonalLeaveRequest={refetchPersonalLeaveRequest}
                refetchProfile={refetchProfile}
                pendingCount={pendingCount}
                approvedCount={approvedCount}
                rejectedCount={rejectedCount}
                onSelect={openSelectedLeaveHandler}
                onDeselect={closeSelectedLeaveHandler}
                actionIsOpen={actionIsOpen}
                toggleAction={toggleAction}
                toggleCancelModal={toggleCancelModal}
                personalLeaveRequest={personalLeaveRequest}
                personalLeaveRequestIsFetching={personalLeaveRequestIsFetching}
              />
            </>
          ) : (
            <>
              {/* No content handler */}
              <VStack space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../assets/vectors/empty.png")}
                  resizeMode="contain"
                  size="2xl"
                  alt="empty"
                />
                <Text>No Data</Text>
              </VStack>
            </>
          )
        ) : (
          <>
            {/* During fetch data is loading handler */}
            <VStack px={3} space={2}>
              <Skeleton h={41} />
              <Skeleton h={41} />
              <Skeleton h={41} />
            </VStack>
          </>
        )}
        {/* </Flex> */}
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
