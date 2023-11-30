import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Image, Text, VStack } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../components/shared/PageHeader";
import EmployeeLeaveDashboard from "../../components/Tribe/Information/EmployeeLeaveDashboard";
import EmployeeInformation from "../../components/Tribe/Information/EmployeeInformation";
import SupervisorInformation from "../../components/Tribe/Information/SupervisorInformation";
import { useFetch } from "../../hooks/useFetch";

const InformationScreen = () => {
  const { data: profile, isFetching: profileIsFetching, refetch: refetchProfile } = useFetch("/hr/my-profile");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <PageHeader title="My Information" backButton={false} />
        </Flex>

        <ScrollView refreshControl={<RefreshControl refreshing={profileIsFetching} onRefresh={refetchProfile} />}>
          <Flex px={3} flex={1} gap={5} py={5}>
            {/* Content here */}
            {!profile?.data ? (
              <VStack space={2} alignItems="center" justifyContent="center">
                <Image source={require("../../assets/vectors/empty.png")} resizeMode="contain" size="2xl" alt="empty" />
                <Text>No Data</Text>
              </VStack>
            ) : (
              <>
                <EmployeeLeaveDashboard
                  name={profile?.data?.name}
                  availableLeave={profile?.data?.leave_quota}
                  pendingApproval={profile?.data?.pending_leave_request}
                  approved={profile?.data?.approved_leave_request}
                />
                <EmployeeInformation
                  id={profile?.data?.id}
                  name={profile?.data?.name}
                  position={profile?.data?.position_name}
                  email={profile?.data?.email}
                  phone={profile?.data?.phone_number}
                  image={profile?.data?.image}
                  refetch={refetchProfile}
                />
                <Text fontSize={16} fontWeight={500} px={3}>
                  My Supervisor
                </Text>
                <SupervisorInformation
                  supervisorId={profile?.data?.supervisor_employee_id}
                  supervisorName={profile?.data?.supervisor_name}
                  supervisorPhone={profile?.data?.supervisor_phone_number}
                  supervisorEmail={profile?.data?.supervisor_email}
                  supervisorImage={profile?.data?.supervisor_image}
                  supervisorPosition={profile?.data?.supervisor_position}
                  refetch={refetchProfile}
                  id={profile?.data?.id}
                />
              </>
            )}
          </Flex>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
  },
});

export default InformationScreen;
