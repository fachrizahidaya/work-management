import { useNavigation } from "@react-navigation/core";

import { SafeAreaView, StyleSheet, View, Text, Image, Linking } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../../hooks/useFetch";
import PageHeader from "../../../components/shared/PageHeader";
import EmployeeLeaveDashboard from "../../../components/Tribe/MyInformation/EmployeeLeaveDashboard";
import EmployeeInformation from "../../../components/Tribe/MyInformation/EmployeeInformation";
import SupervisorInformation from "../../../components/Tribe/MyInformation/SupervisorInformation";
import { TextProps } from "../../../components/shared/CustomStylings";

const MyInformationScreen = () => {
  const navigation = useNavigation();

  const { data: profile, isFetching: profileIsFetching, refetch: refetchProfile } = useFetch("/hr/my-profile");

  const leaveStatusArr = [
    {
      id: 1,
      name: "Available Leave",
      icon: "clipboard-outline",
      qty: profile?.data?.leave_quota,
      backgroundColor: "#E8E9EB",
      iconColor: "#377893",
      onPress: () =>
        navigation.navigate("New Leave Request", {
          employeeId: profile?.data?.id,
        }),
    },
    {
      id: 2,
      name: "Pending Approval",
      icon: "clipboard-pulse-outline",
      qty: profile?.data?.pending_leave_request,
      backgroundColor: "#FAF6E8",
      iconColor: "#FFD240",
      onPress: () => navigation.navigate("Leave Requests"),
    },
    {
      id: 3,
      name: "Approved",
      icon: "clipboard-check-outline",
      qty: profile?.data?.approved_leave_request,
      backgroundColor: "#E9F5EC",
      iconColor: "#49C96D",
      onPress: () => navigation.navigate("Leave Requests"),
    },
  ];

  /**
   * Handle press icon call
   * @param {*} phone
   */
  const pressCallHandler = (phone) => {
    Linking.openURL(phone).catch((err) => console.log(err));
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PageHeader title="My Information" backButton={false} />
        </View>

        <ScrollView refreshControl={<RefreshControl refreshing={profileIsFetching} onRefresh={refetchProfile} />}>
          <View style={styles.content}>
            {/* Content here */}
            {!profile?.data ? (
              <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
                {/* <Image
                  source={require("../../../assets/vectors/empty.png")}
                  style={{ width: 300, height: 300, resizeMode: "contain" }}
                  alt="empty"
                /> */}
                <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
              </View>
            ) : (
              <>
                <EmployeeLeaveDashboard leaveStatus={leaveStatusArr} />
                <EmployeeInformation
                  id={profile?.data?.id}
                  name={profile?.data?.name}
                  position={profile?.data?.position_name}
                  email={profile?.data?.email}
                  phone={profile?.data?.phone_number}
                  image={profile?.data?.image}
                  navigation={navigation}
                />
                <Text style={[TextProps, { fontSize: 16, fontWeight: "500", paddingHorizontal: 10 }]}>
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
                  navigation={navigation}
                  onClickCall={pressCallHandler}
                />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MyInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  content: {
    paddingHorizontal: 10,
    flex: 1,
    gap: 10,
    paddingVertical: 20,
  },
});
