import { useNavigation } from "@react-navigation/native";

import { Flex, Image, Text, VStack, useToast } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import TeamLeaveRequestList from "../../../../components/Tribe/Leave/TeamLeaveRequest/TeamLeaveRequestList";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";

const TeamLeaveScreen = () => {
  const navigation = useNavigation();

  const toast = useToast();

  const {
    data: teamLeaveRequestData,
    refetch: refetchTeamLeaveRequest,
    isFetching: teamLeaveRequestIsFetching,
    isLoading: teamLeaveRequestIsLoading,
  } = useFetch("/hr/leave-requests/waiting-approval");

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
      refetchTeamLeaveRequest();
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

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader width={200} title="My Team Leave Request" onPress={() => navigation.goBack()} />
      </Flex>
      {teamLeaveRequestData?.data.length > 0 ? (
        <FlashList
          data={teamLeaveRequestData?.data}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl refreshing={teamLeaveRequestIsFetching} onRefresh={refetchTeamLeaveRequest} />
          }
          renderItem={({ item }) => (
            <>
              <TeamLeaveRequestList
                key={item?.id}
                name={item?.employee_name}
                image={item?.employee_image}
                leaveName={item?.leave_name}
                days={item?.days}
                startDate={item?.begin_date}
                endDate={item?.end_date}
                status={item?.status}
                reason={item?.reason}
                type={item?.approval_type}
                objectId={item?.approval_object_id}
                object={item?.approval_object}
                refetchTeamLeaveRequest={refetchTeamLeaveRequest}
                onApproval={approvalResponseHandler}
              />
            </>
          )}
        />
      ) : (
        <VStack space={2} alignItems="center" justifyContent="center">
          <Image source={require("../../../../assets/vectors/empty.png")} resizeMode="contain" size="2xl" alt="empty" />
          <Text>No Data</Text>
        </VStack>
      )}
    </SafeAreaView>
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
