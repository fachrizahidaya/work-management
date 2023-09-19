import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import PayslipList from "../../components/Tribe/PayslipList";
import { useFetch } from "../../hooks/useFetch";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";

const PayslipScreen = () => {
  const [myPayslip, setMyPayslip] = useState();
  const { data: payslip } = useFetch("/hr/payslip");

  const handlePayslip = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Text fontSize={16}>My Payslip</Text>
        </Flex>
        <Text fontWeight={700} fontSize={12}>
          PT Kolabora Group Indonesia
        </Text>
      </Flex>
      <FlashList
        data={payslip?.data}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <PayslipList key={item?.id} id={item?.id} month={item?.pay_month} year={item?.pay_year} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
});

export default PayslipScreen;
