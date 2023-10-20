import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../../components/shared/PageHeader";
import ReimbursementList from "../../../components/Tribe/Reimbursement/ReimbursementList";

const ReimbursementScreen = () => {
  const reimbursements = [
    {
      title: "Grab",
      description: "Visit client di Jakarta Pusat",
      total: 250000,
      date: "2023-10-17",
      status: "Pending",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Reimbursement" backButton={false} />
      </Flex>
      <ScrollView>
        <ReimbursementList data={reimbursements} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReimbursementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
