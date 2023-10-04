import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Text } from "native-base";

import LeaveDashboardUser from "../../components/Tribe/Information/LeaveDashboardUser";
import EmployeeInformation from "../../components/Tribe/Information/EmployeeInformation";
import SupervisorInformation from "../../components/Tribe/Information/SupervisorInformation";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import { ScrollView } from "react-native-gesture-handler";

const InformationScreen = () => {
  const { data: profile } = useFetch("/hr/my-profile");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <PageHeader title="My Information" backButton={false} />
        </Flex>

        <ScrollView>
          <Flex px={3} flex={1} gap={5} mt={5}>
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
              supervisorPhone={profile?.data?.supervisor_phone_number}
              supervisorEmail={profile?.data?.supervisor_email}
              supervisorImage={profile?.data?.supervisor_image}
              supervisorPosition={profile?.data?.supervisor_position}
            />
          </Flex>
        </ScrollView>
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
