import { SafeAreaView, StyleSheet, View } from "react-native";
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          padding: 10,
        }}
      >
        <PageHeader title="My Reimbursement" backButton={false} />
      </View>
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
