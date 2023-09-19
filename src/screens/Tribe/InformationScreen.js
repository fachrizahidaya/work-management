import { SafeAreaView, StyleSheet } from "react-native";
import { useFetch } from "../../hooks/useFetch";
import { Flex, Text } from "native-base";
import LeaveDashboardUser from "../../components/Tribe/Information/LeaveDashboardUser";
import EmployeeInformation from "../../components/Tribe/Information/EmployeeInformation";
import SupervisorInformation from "../../components/Tribe/Information/SupervisorInformation";

const InformationScreen = () => {
  const { data: profile } = useFetch("/hr/my-profile");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Information</Text>
          </Flex>
          <Text fontWeight={700} fontSize={12}>
            PT Kolabora Group Indonesia
          </Text>
        </Flex>

        <Flex px={5} flex={1} flexDir="column" gap={5} my={5}>
          {/* Content here */}
          <LeaveDashboardUser
            name={profile?.data?.name}
            availableLeave={profile?.data?.leave_quota}
            pendingApproval={profile?.data?.pending_leave_request}
            approved={profile?.data?.approved_leave_request}
          />
          <EmployeeInformation
            name={profile?.data?.name}
            position={profile?.data?.position_name}
            email={profile?.data?.email}
            phone={profile?.data?.phone_number}
            image={profile?.data?.image}
          />
          <SupervisorInformation
            supervisorName={profile?.data?.supervisor_name}
            supervisorEmail={profile?.data?.supervisor_phone_number}
            supervisorPhone={profile?.data?.supervisor_email}
            supervisorImage={profile?.data?.supervisor_image}
            supervisorPosition={profile?.data?.supervisor_position}
          />
        </Flex>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
});

export default InformationScreen;
