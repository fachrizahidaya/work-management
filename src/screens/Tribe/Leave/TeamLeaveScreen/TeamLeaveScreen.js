import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { Flex, Image, Skeleton, Spinner, Text, VStack, useToast } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";
import TeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/TeamLeaveRequestList";

const TeamLeaveScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation();

  const toast = useToast();

  const {
    data: teamLeaveRequestData,
    refetch: refetchTeamLeaveRequest,
    isFetching: teamLeaveRequestIsFetching,
    isLoading: teamLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/waiting-approval");

  const pendingLeaveRequests = teamLeaveRequestData?.data.filter((request) => request.status === "Pending");
  const pendingCount = pendingLeaveRequests.length;
  const approvedLeaveRequests = teamLeaveRequestData?.data.filter((request) => request.status === "Approved");
  const approvedCount = approvedLeaveRequests.length;
  const rejectedLeaveRequests = teamLeaveRequestData?.data.filter((request) => request.status === "Rejected");
  const rejectedCount = rejectedLeaveRequests.length;

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
      toast.show({
        render: ({ id }) => {
          return (
            <SuccessToast
              message={data.status === "Approved" ? "Request Approved" : "Request Rejected"}
              close={() => toast.close(id)}
            />
          );
        },
      });
      refetchTeamLeaveRequest();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Process failed, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  });

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isReady ? (
          <>
            <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
              <PageHeader width={200} title="My Team Leave Request" onPress={() => navigation.goBack()} />
            </Flex>
            {!teamLeaveRequestIsLoading ? (
              teamLeaveRequestData?.data.length > 0 ? (
                <>
                  <TeamLeaveRequestList
                    pendingLeaveRequests={pendingLeaveRequests}
                    approvedLeaveRequests={approvedLeaveRequests}
                    rejectedLeaveRequests={rejectedLeaveRequests}
                    pendingCount={pendingCount}
                    approvedCount={approvedCount}
                    rejectedCount={rejectedCount}
                    teamLeaveRequestData={teamLeaveRequestData}
                    teamLeaveRequestIsFetching={teamLeaveRequestIsFetching}
                    refetchTeamLeaveRequest={refetchTeamLeaveRequest}
                    onApproval={approvalResponseHandler}
                  />
                </>
              ) : (
                <VStack space={2} alignItems="center" justifyContent="center">
                  <Image
                    source={require("../../../../assets/vectors/empty.png")}
                    resizeMode="contain"
                    size="2xl"
                    alt="empty"
                  />
                  <Text>No Data</Text>
                </VStack>
              )
            ) : (
              <VStack px={3} space={2}>
                <Skeleton h={41} />
                <Skeleton h={41} />
                <Skeleton h={41} />
              </VStack>
            )}
          </>
        ) : (
          <VStack mt={10} px={4} space={2}>
            <Spinner color="primary.600" size="lg" />
          </VStack>
        )}
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
});
