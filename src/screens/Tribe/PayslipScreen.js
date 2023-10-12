import { useFormik } from "formik";

import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Image, Skeleton, Text, VStack, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import PayslipPasswordEdit from "../../components/Tribe/Payslip/PayslipPasswordEdit";
import { useDisclosure } from "../../hooks/useDisclosure";
import { SuccessToast } from "../../components/shared/ToastDialog";

const PayslipScreen = () => {
  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(false);

  const toast = useToast();

  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
    isLoading: payslipIsLoading,
  } = useFetch("/hr/payslip");

  const payslipPasswordUpdateHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/payslip/change-password`, data);
      setSubmitting(false);
      setStatus("success");
      refetchPayslip();
      toast.show({
        render: () => {
          return <SuccessToast message={"Password Updated"} />;
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <PageHeader title="My Payslip" backButton={false} />
        <Button onPress={() => toggleForm()}>
          <Text color="#FFFFFF" fontSize={12} fontWeight={500}>
            Change PIN
          </Text>
        </Button>
        <PayslipPasswordEdit formIsOpen={formIsOpen} toggleForm={toggleForm} onSubmit={payslipPasswordUpdateHandler} />
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
            <Image source={require("./../../assets/vectors/empty.png")} alt="empty" resizeMode="contain" size="2xl" />
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
