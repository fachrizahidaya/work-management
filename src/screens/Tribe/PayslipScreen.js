import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Image, Skeleton, Text, VStack } from "native-base";

import { FlashList } from "@shopify/flash-list";

import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import { RefreshControl } from "react-native-gesture-handler";

const PayslipScreen = () => {
  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
    isLoading: payslipIsLoading,
  } = useFetch("/hr/payslip");

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Payslip" backButton={false} />
      </Flex>

      {!payslipIsLoading ? (
        payslip?.data.length > 0 ? (
          <FlashList
            data={payslip?.data}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            estimatedItemSize={100}
            refreshControl={<RefreshControl refreshing={payslipIsFetching} onRefresh={refetchPayslip} />}
            renderItem={({ item }) => (
              <PayslipList key={item?.id} id={item?.id} month={item?.pay_month} year={item?.pay_year} />
            )}
          />
        ) : (
          <VStack space={2} alignItems="center" justifyContent="center">
            <Image
              source={require("./../../assets/vectors/empty.jpg")}
              h={200}
              w={200}
              alt="empty"
              resizeMode="contain"
            />
            <Text>No Data</Text>
          </VStack>
        )
      ) : (
        <VStack px={3} space={2}>
          <Skeleton h={41} />
          <Skeleton h={41} />
        </VStack>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
});

export default PayslipScreen;
