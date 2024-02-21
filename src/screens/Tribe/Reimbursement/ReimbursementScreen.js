import { useCallback, useMemo, useState } from "react";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../../components/shared/PageHeader";
import ReimbursementList from "../../../components/Tribe/Reimbursement/ReimbursementList";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ReimbursementScreen = () => {
  const [tabValue, setTabValue] = useState("pending");

  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } =
    useDisclosure(false);

  const tabs = useMemo(() => {
    return [
      { title: "pending", value: "pending" },
      { title: "approved", value: "approved" },
      { title: "rejected", value: "rejected" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

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
        <ReimbursementList
          data={reimbursements}
          tabs={tabs}
          tabValue={tabValue}
          onChangeTab={onChangeTab}
        />
      </ScrollView>
      <ConfirmationModal
        isOpen={cancelModalIsOpen}
        toggle={toggleCancelModal}
        // apiUrl={``}
        hasSuccessFunc={true}
        header="Cancel Leave Request"
        // onSuccess={() => {

        // }}
        description="Are you sure to cancel this request?"
        successMessage="Request canceled"
        isDelete={false}
        isPatch={true}
      />
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
