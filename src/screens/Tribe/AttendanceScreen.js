import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import AttendanceCalendar from "../../components/Tribe/Attendance/AttendanceCalendar";

const AttendanceScreen = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Attendance Log</Text>
          </Flex>
          <Text fontWeight={700} fontSize={12}>
            PT Kolabora Group Indonesia
          </Text>
        </Flex>
        <AttendanceCalendar />
      </SafeAreaView>
    </>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
