import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Image, Skeleton, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import LeaveRequestList from "../../../components/Tribe/Leave/LeaveRequestList";
import { useFetch } from "../../../hooks/useFetch";
import PageHeader from "../../../components/shared/PageHeader";
import axiosInstance from "../../../config/api";

const LeaveScreen = () => {
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

  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader title="My Leave Request" backButton={false} />
          {profile?.data?.position_name.includes("Manager", "Head") ? (
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
            <FlashList
              data={personalLeaveRequest?.data}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              estimatedItemSize={100}
              refreshControl={
                <RefreshControl refreshing={personalLeaveRequestIsFetching} onRefresh={refetchPersonalLeaveRequest} />
              }
              renderItem={({ item }) => (
                <LeaveRequestList
                  key={item?.id}
                  id={item?.id}
                  leaveName={item?.leave_name}
                  days={item?.days}
                  startDate={item?.begin_date}
                  endDate={item?.end_date}
                  status={item?.status}
                  supervisorName={item?.supervisor_name}
                  reason={item?.reason}
                  refetchPersonalLeaveRequest={refetchPersonalLeaveRequest}
                  refetchProfile={refetchProfile}
                />
              )}
            />
          ) : (
            <VStack space={2} alignItems="center" justifyContent="center">
              <Image
                source={require("../../../assets/vectors/empty.png")}
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
