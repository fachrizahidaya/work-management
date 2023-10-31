import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

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
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import useCheckAccess from "../../hooks/useCheckAccess";

const PayslipScreen = () => {
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const downloadPayslipCheckAccess = useCheckAccess("download", "Payslip");

  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(false);

  const toast = useToast();

  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
    isLoading: payslipIsLoading,
  } = useFetch("/hr/payslip");

  /**
   * Change password handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: yup.object().shape({
      old_password: yup.string().required("Old Password is required"),
      new_password: yup.string().required("New Password is required"),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Password doesn't match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      payslipPasswordUpdateHandler(values, setSubmitting, setStatus);
    },
  });

  /**
   * Document Password update handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipPasswordUpdateHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/payslip/change-password`, data);
      setSubmitting(false);
      setStatus("success");
      formik.resetForm();
      refetchPayslip();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={"Password Updated"} close={() => toast.close(id)} />;
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setPasswordError(err.response.data.message);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={err.response.data.message} close={() => toast.close(id)} />;
        },
        placement: "top",
      });
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
        <PayslipPasswordEdit
          formIsOpen={formIsOpen}
          toggleForm={toggleForm}
          onSubmit={payslipPasswordUpdateHandler}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          formik={formik}
          hideNewPassword={hideNewPassword}
          setHideNewPassword={setHideNewPassword}
          hideOldPassword={hideOldPassword}
          setHideOldPassword={setHideOldPassword}
          hideConfirmPassword={hideConfirmPassword}
          setHideConfirmPassword={setHideConfirmPassword}
        />
      </Flex>

      {payslip?.data.length > 0 ? (
        <FlashList
          data={payslip?.data}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={100}
          refreshControl={<RefreshControl refreshing={payslipIsFetching} onRefresh={refetchPayslip} />}
          renderItem={({ item }) => (
            <PayslipList
              key={item?.id}
              id={item?.id}
              month={item?.pay_month}
              year={item?.pay_year}
              downloadPayslipCheckAccess={downloadPayslipCheckAccess}
            />
          )}
        />
      ) : (
        <VStack space={2} alignItems="center" justifyContent="center">
          <Image source={require("./../../assets/vectors/empty.png")} alt="empty" resizeMode="contain" size="2xl" />
          <Text>No Data</Text>
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
