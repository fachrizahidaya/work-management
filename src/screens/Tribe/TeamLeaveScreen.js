import { useNavigation } from "@react-navigation/native";

import { Flex } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import TeamLeaveRequestList from "../../components/Tribe/Leave/my-team/TeamLeaveRequestList";

const TeamLeaveScreen = () => {
  const navigation = useNavigation();

  const {
    data: teamLeaveRequest,
    refetch: refetchTeamLeaveRequest,
    isFetching: teamLeaveRequestIsFetching,
  } = useFetch("/hr/leave-requests/waiting-approval");

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Team Leave Request" onPress={() => navigation.navigate("Leave Request")} />
      </Flex>
      <FlashList
        data={teamLeaveRequest?.data}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <>
            <TeamLeaveRequestList
              key={item?.id}
              id={item?.id}
              name={item?.employee_name}
              leaveName={item?.leave_name}
              days={item?.days}
              startDate={item?.begin_date}
              endDate={item?.end_date}
              status={item?.status}
              reason={item?.reason}
            />
          </>
        )}
      />
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
