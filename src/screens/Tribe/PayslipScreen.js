import { useEffect, useState } from "react";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Text } from "native-base";

import { FlashList } from "@shopify/flash-list";
import dayjs from "dayjs";

import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";

const PayslipScreen = () => {
  const { data: payslip } = useFetch("/hr/payslip");

  return (
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
        <PageHeader title="My Payslip" backButton={false} />
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
