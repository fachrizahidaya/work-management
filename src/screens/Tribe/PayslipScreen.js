import { useState } from "react";

import { Linking, SafeAreaView, StyleSheet } from "react-native";
import { Box, Button, Flex, Image, Spinner, Text, VStack, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import { useFetch } from "../../hooks/useFetch";
import { useDisclosure } from "../../hooks/useDisclosure";
import PageHeader from "../../components/shared/PageHeader";
import axiosInstance from "../../config/api";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import useCheckAccess from "../../hooks/useCheckAccess";
import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import PayslipPasswordEdit from "../../components/Tribe/Payslip/PayslipPasswordEdit";
import PayslipDownload from "../../components/Tribe/Payslip/PayslipDownload";

const PayslipScreen = () => {
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [passwordDownloadError, setPasswordDownloadError] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  const downloadPayslipCheckAccess = useCheckAccess("download", "Payslip");

  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(false);
  const { isOpen: downloadDialogIsOpen, toggle: toggleDownloadDialog } = useDisclosure(false);

  const toast = useToast();

  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
    isLoading: payslipIsLoading,
  } = useFetch("/hr/payslip");

  const openSelectedPayslip = (data) => {
    toggleDownloadDialog();
    setSelectedPayslip(data);
  };

  const closeSelectedPayslip = () => {
    toggleDownloadDialog();
    setSelectedPayslip(null);
  };

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
      });
    }
  };

  /**
   * Download payslip Handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipDownloadHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.get(`/hr/payslip/${selectedPayslip}/download`, {
        params: data,
      });
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res?.data?.data}`);
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setPasswordError(err.response.data.message);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Download failed, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  };

  return (
    <>
      <SafeAreaView style={payslip?.data?.length > 0 ? styles.container : styles.containerEmpty}>
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
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            hideNewPassword={hideNewPassword}
            setHideNewPassword={setHideNewPassword}
            hideOldPassword={hideOldPassword}
            setHideOldPassword={setHideOldPassword}
            hideConfirmPassword={hideConfirmPassword}
            setHideConfirmPassword={setHideConfirmPassword}
            onUpdatePassword={payslipPasswordUpdateHandler}
          />
        </Flex>

        <Box></Box>
        {payslip?.data.length > 0 ? (
          <FlashList
            data={payslip?.data}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={5}
            keyExtractor={(item, index) => index}
            onScrollBeginDrag={() => setHasBeenScrolled(true)}
            onEndReachedThreshold={0.1}
            estimatedItemSize={100}
            refreshControl={<RefreshControl refreshing={payslipIsFetching} onRefresh={refetchPayslip} />}
            ListFooterComponent={() => payslipIsLoading && hasBeenScrolled && <Spinner color="primary.600" size="lg" />}
            renderItem={({ item, index }) => (
              <PayslipList
                key={index}
                id={item?.id}
                month={item?.pay_month}
                year={item?.pay_year}
                downloadPayslipCheckAccess={downloadPayslipCheckAccess}
                onDownloadPayslip={payslipDownloadHandler}
                downloadDialogIsOpen={downloadDialogIsOpen}
                toggleDownloadDialog={toggleDownloadDialog}
                openSelectedPayslip={openSelectedPayslip}
                closeSelectedPayslip={closeSelectedPayslip}
              />
            )}
          />
        ) : payslipIsFetching ? (
          <Spinner size="sm" />
        ) : (
          <VStack mt={20} space={2} alignItems="center" justifyContent="center">
            <Image source={require("./../../assets/vectors/empty.png")} alt="empty" resizeMode="contain" size="2xl" />
            <Text>No Data</Text>
          </VStack>
        )}
      </SafeAreaView>
      <PayslipDownload
        downloadDialogIsOpen={downloadDialogIsOpen}
        toggleDownloadDialog={closeSelectedPayslip}
        passwordError={passwordDownloadError}
        setPasswordError={setPasswordDownloadError}
        downloadPayslipCheckAccess={downloadPayslipCheckAccess}
        onDownloadPayslip={payslipDownloadHandler}
      />
    </>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  containerEmpty: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    position: "relative",
  },
});
