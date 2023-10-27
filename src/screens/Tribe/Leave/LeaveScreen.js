import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Image, Skeleton, Text, VStack } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import LeaveRequestList from "../../../components/Tribe/Leave/LeaveRequestList";
import { useFetch } from "../../../hooks/useFetch";
import PageHeader from "../../../components/shared/PageHeader";
import useCheckAccess from "../../../hooks/useCheckAccess";

const LeaveScreen = () => {
  const navigation = useNavigation();

  const {
    data: personalLeaveRequest,
    refetch: refetchPersonalLeaveRequest,
    isFetching: personalLeaveRequestIsFetching,
    isLoading: personalLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/personal");

  const {
    data: profile,
    refetch: refetchProfile,
    isFetching: profileIsFetching,
    isLoading: profileIsLoading,
  } = useFetch("/hr/my-profile");

  const {
    data: teamLeaveRequest,
    refetch: refetchTeamLeaveRequest,
    isFetching: teamLeaveRequestIsFetching,
    isLoading: teamLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/waiting-approval");

  /**
   * Filtered leave handler
   */
  const pendingLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Pending");
  const pendingCount = pendingLeaveRequests.length;
  const approvedLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Approved");
  const approvedCount = approvedLeaveRequests.length;
  const rejectedLeaveRequests = personalLeaveRequest?.data.filter((request) => request.status === "Rejected");
  const rejectedCount = rejectedLeaveRequests.length;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader title="My Leave Request" backButton={false} />
          {/* These are the position that will get team leave */}
          {profile?.data?.position_id !== 1 ||
          profile?.data?.position_id !== 11 ||
          profile?.data?.position_id !== 13 ||
          profile?.data?.position_id !== 17 ||
          profile?.data?.position_id !== 20 ||
          profile?.data?.position_id !== 22 ||
          profile?.data?.position_id !== 28 ||
          profile?.data?.position_id !== 31 ||
          profile?.data?.position_id !== 34 ||
          profile?.data?.position_id !== 39 ||
          profile?.data?.position_id !== 40 ||
          profile?.data?.position_id !== 46 ? (
            <Button
              onPress={() =>
                navigation.navigate("Team Leave Request", {
                  teamLeaveRequest: teamLeaveRequest,
                  teamLeaveRequestIsLoading: teamLeaveRequestIsLoading,
                  refetchTeamLeaveRequest: refetchTeamLeaveRequest,
                  teamLeaveRequestIsFetching: teamLeaveRequestIsFetching,
                })
              }
              size="sm"
            >
              My Team
            </Button>
          ) : null}
        </Flex>
        {!personalLeaveRequestIsLoading ? (
          personalLeaveRequest?.data.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={refetchPersonalLeaveRequest} refreshing={personalLeaveRequestIsFetching} />
              }
            >
              {/* Content here */}
              <LeaveRequestList
                data={personalLeaveRequest?.data}
                pendingLeaveRequests={pendingLeaveRequests}
                approvedLeaveRequests={approvedLeaveRequests}
                rejectedLeaveRequests={rejectedLeaveRequests}
                refetchPersonalLeaveRequest={refetchPersonalLeaveRequest}
                refetchProfile={refetchProfile}
                pendingCount={pendingCount}
                approvedCount={approvedCount}
                rejectedCount={rejectedCount}
                personalLeaveRequestIsFetching={personalLeaveRequestIsFetching}
              />
            </ScrollView>
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
      </SafeAreaView>
    </>
  );
};

export default LeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
