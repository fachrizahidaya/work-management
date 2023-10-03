import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Text } from "native-base";

import { FlashList } from "@shopify/flash-list";

import LeaveRequestList from "../../components/Tribe/Leave/LeaveRequestList";
import { useFetch } from "../../hooks/useFetch";

const LeaveScreen = () => {
  const { data: personalLeaveRequest } = useFetch("/hr/leave-requests/personal");
  const { data: profile } = useFetch("/hr/my-profile");
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Leave Request</Text>
          </Flex>
          {profile?.data?.position_name.includes("Manager", "Head") ? (
            <Button onPress={() => navigation.navigate("Team Leave Request")} size="sm">
              My Team
            </Button>
          ) : null}
        </Flex>
        <FlashList
          data={personalLeaveRequest?.data}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={100}
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
            />
          )}
        />
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
