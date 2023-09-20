import { Button, Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { useFetch } from "../../hooks/useFetch";
import LeaveRequestList from "../../components/Tribe/Leave/LeaveRequestList";
import { FlashList } from "@shopify/flash-list";

const LeaveScreen = () => {
  const { data: personalLeave } = useFetch("/hr/leave-requests/personal");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          bgColor="white"
          py={14}
          px={15}
          borderBottomWidth={1}
          borderBottomColor="#cbcbcb"
        >
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Leave Request</Text>
          </Flex>
          <Button size="sm">My Team</Button>
        </Flex>
        <FlashList
          data={personalLeave?.data}
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
